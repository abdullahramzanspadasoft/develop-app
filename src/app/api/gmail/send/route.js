import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Dynamic import for googleapis to avoid build issues
let google
try {
  const googleapis = require('googleapis')
  google = googleapis.google
} catch (error) {
  console.warn('Google APIs not available:', error.message)
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    // Check if googleapis is available
    if (!google) {
      return NextResponse.json(
        { error: 'Gmail API not configured. Please install googleapis.' },
        { status: 500 }
      )
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get access token from session
    const accessToken = session.accessToken
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token available' }, { status: 401 })
    }

    // Parse request body
    const { to, subject, body } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body' },
        { status: 400 }
      )
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    )
    
    oauth2Client.setCredentials({
      access_token: accessToken
    })

    // Create Gmail API instance
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

    // Create email message
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      body
    ].join('\n')

    // Encode message in base64url format
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    // Send the message
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    })

    return NextResponse.json({
      success: true,
      messageId: response.data.id,
      message: 'Email sent successfully'
    })

  } catch (error) {
    console.error('Gmail Send Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error.message 
      },
      { status: 500 }
    )
  }
}