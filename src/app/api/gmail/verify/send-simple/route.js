import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple fallback email service using console logging
// This is for testing when SMTP is not configured

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000)) // 6 digits
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
    
    // Generate verification code
    const code = generateCode()
    
    // For testing - log the code to console
    console.log('='.repeat(50))
    console.log('📧 GMAIL VERIFICATION CODE')
    console.log('='.repeat(50))
    console.log(`📧 Email: ${email}`)
    console.log(`🔢 Code: ${code}`)
    console.log(`⏰ Expires: 10 minutes`)
    console.log('='.repeat(50))
    console.log('')
    console.log('💡 This is a test mode. In production, this code would be sent via email.')
    console.log('💡 For real email sending, configure SMTP settings in .env.local')
    console.log('')
    
    return NextResponse.json({
      success: true,
      message: `Verification code generated: ${code}. Check console for details.`,
      maskedEmail: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      testMode: true,
      code: code // Only for testing
    })
    
  } catch (error) {
    console.error('Simple verification error:', error)
    return NextResponse.json(
      { error: 'Failed to generate verification code' },
      { status: 500 }
    )
  }
}
