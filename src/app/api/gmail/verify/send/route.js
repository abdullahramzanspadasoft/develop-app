import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Dynamic import for nodemailer to avoid build issues
let nodemailer
try {
  nodemailer = require('nodemailer')
} catch (error) {
  console.warn('Nodemailer not available:', error.message)
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// In-memory store for verification codes (use database in production)
const verificationCodes = new Map()
const rateLimit = new Map()

// Rate limiting: 5 attempts per IP per hour, 3 attempts per email per hour
const RATE_LIMIT_IP = 5
const RATE_LIMIT_EMAIL = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)) // 6 digits
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex')
}

function isRateLimited(ip, email) {
  const now = Date.now()
  
  // Check IP rate limit
  if (rateLimit.has(ip)) {
    const ipData = rateLimit.get(ip)
    if (now - ipData.timestamp < RATE_LIMIT_WINDOW && ipData.count >= RATE_LIMIT_IP) {
      return { limited: true, type: 'ip' }
    }
  }
  
  // Check email rate limit
  if (rateLimit.has(email)) {
    const emailData = rateLimit.get(email)
    if (now - emailData.timestamp < RATE_LIMIT_WINDOW && emailData.count >= RATE_LIMIT_EMAIL) {
      return { limited: true, type: 'email' }
    }
  }
  
  return { limited: false }
}

function updateRateLimit(ip, email) {
  const now = Date.now()
  
  // Update IP rate limit
  if (rateLimit.has(ip)) {
    const ipData = rateLimit.get(ip)
    if (now - ipData.timestamp < RATE_LIMIT_WINDOW) {
      ipData.count++
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now })
    }
  } else {
    rateLimit.set(ip, { count: 1, timestamp: now })
  }
  
  // Update email rate limit
  if (rateLimit.has(email)) {
    const emailData = rateLimit.get(email)
    if (now - emailData.timestamp < RATE_LIMIT_WINDOW) {
      emailData.count++
    } else {
      rateLimit.set(email, { count: 1, timestamp: now })
    }
  } else {
    rateLimit.set(email, { count: 1, timestamp: now })
  }
}

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    // Validate email
    if (!email || !email.endsWith('@gmail.com')) {
      return NextResponse.json(
        { error: 'Please enter a valid Gmail address (example@gmail.com).' },
        { status: 400 }
      )
    }
    
    // Get client IP
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    // Check rate limiting
    const rateLimitCheck = isRateLimited(ip, email)
    if (rateLimitCheck.limited) {
      if (rateLimitCheck.type === 'ip') {
        return NextResponse.json(
          { error: 'Too many attempts. Try again later.' },
          { status: 429 }
        )
      } else {
        return NextResponse.json(
          { error: 'Too many attempts. Try again later.' },
          { status: 429 }
        )
      }
    }
    
    // Generate verification code
    const code = generateCode()
    const hash = hashCode(code)
    const expires = Date.now() + 10 * 60 * 1000 // 10 minutes
    
    // Store verification code
    verificationCodes.set(email, {
      hash,
      expires,
      attempts: 0,
      maxAttempts: 3
    })
    
    // Update rate limit
    updateRateLimit(ip, email)
    
    // Check if nodemailer is available
    if (!nodemailer) {
      return NextResponse.json(
        { error: 'Email service not configured. Please install nodemailer.' },
        { status: 500 }
      )
    }

    // Configure email transporter with build-safe environment access
    const smtpHost = typeof process !== 'undefined' ? process.env.SMTP_HOST : undefined
    const smtpPort = typeof process !== 'undefined' ? process.env.SMTP_PORT : undefined
    const smtpUser = typeof process !== 'undefined' ? process.env.SMTP_USER : undefined
    const smtpPass = typeof process !== 'undefined' ? process.env.SMTP_PASS : undefined
    
    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: 'Email service not configured. Please set SMTP_USER and SMTP_PASS environment variables.' },
        { status: 500 }
      )
    }
    
    const transporter = nodemailer.createTransporter({
      host: smtpHost || 'smtp.gmail.com',
      port: parseInt(smtpPort) || 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
    } catch (error) {
      console.error('SMTP configuration error:', error)
      return NextResponse.json(
        { error: 'Email service configuration error. Please check SMTP settings.' },
        { status: 500 }
      )
    }
    
    // Send verification email
    try {
      await transporter.sendMail({
        from: `"Watch Store" <${smtpUser}>`,
        to: email,
        subject: 'Your Gmail Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Gmail Verification Code</h2>
            <p>Hello,</p>
            <p>You requested to verify your Gmail address for Watch Store. Your verification code is:</p>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
            </div>
            <p><strong>This code expires in 10 minutes.</strong></p>
            <p>If you didn't request this verification, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from Watch Store. Please do not reply to this email.
            </p>
          </div>
        `,
        text: `Your Gmail verification code is: ${code}. This code expires in 10 minutes.`
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return NextResponse.json(
        { error: 'Failed to send verification email. Please check your email settings.' },
        { status: 500 }
      )
    }
    
    // Clean up old rate limit entries
    for (const [key, data] of rateLimit.entries()) {
      if (Date.now() - data.timestamp > RATE_LIMIT_WINDOW) {
        rateLimit.delete(key)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'A verification code has been sent to your Gmail. Enter it below to continue.',
      maskedEmail: email.replace(/(.{2}).*(@.*)/, '$1***$2')
    })
    
  } catch (error) {
    console.error('Gmail verification send error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    )
  }
}
