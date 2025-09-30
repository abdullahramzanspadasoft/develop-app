import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Import the same verification codes map (in production, use a shared database)
const verificationCodes = new Map()

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex')
}

export async function POST(request) {
  try {
    const { email, code } = await request.json()
    
    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and verification code are required.' },
        { status: 400 }
      )
    }
    
    // Check if verification code exists
    const record = verificationCodes.get(email)
    if (!record) {
      return NextResponse.json(
        { error: 'No verification code found for this email. Please request a new code.' },
        { status: 400 }
      )
    }
    
    // Check if code has expired
    if (Date.now() > record.expires) {
      verificationCodes.delete(email)
      return NextResponse.json(
        { error: 'Verification code expired. Request a new code.' },
        { status: 400 }
      )
    }
    
    // Check attempt limit
    if (record.attempts >= record.maxAttempts) {
      verificationCodes.delete(email)
      return NextResponse.json(
        { error: 'Too many attempts. Request a new code.' },
        { status: 400 }
      )
    }
    
    // Increment attempt counter
    record.attempts++
    
    // Verify the code
    if (hashCode(code) === record.hash) {
      // Code is correct - remove it and mark as verified
      verificationCodes.delete(email)
      
      return NextResponse.json({
        success: true,
        message: 'Gmail address verified successfully!',
        verified: true
      })
    } else {
      // Code is incorrect
      if (record.attempts >= record.maxAttempts) {
        verificationCodes.delete(email)
        return NextResponse.json(
          { error: 'Too many attempts. Request a new code.' },
          { status: 400 }
        )
      }
      
      const remainingAttempts = record.maxAttempts - record.attempts
      return NextResponse.json(
        { 
          error: `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`,
          attemptsRemaining: remainingAttempts
        },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Gmail verification check error:', error)
    return NextResponse.json(
      { error: 'Failed to verify code. Please try again.' },
      { status: 500 }
    )
  }
}
