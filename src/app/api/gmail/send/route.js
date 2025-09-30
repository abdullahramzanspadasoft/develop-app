import { NextResponse } from 'next/server'

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

    // Authentication temporarily disabled
    // const session = await getServerSession(authOptions)
    
    // if (!session?.user?.email) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    // Access token temporarily disabled
    // const accessToken = session.accessToken
    
    // if (!accessToken) {
    //   return NextResponse.json({ error: 'No access token available' }, { status: 401 })
    // }

    // Parse request body
    const { to, subject, body } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, body' },
        { status: 400 }
      )
    }

    // Create OAuth2 client with build-safe environment access
    const googleClientId = typeof process !== 'undefined' ? process.env.GOOGLE_CLIENT_ID : undefined
    const googleClientSecret = typeof process !== 'undefined' ? process.env.GOOGLE_CLIENT_SECRET : undefined
    
    if (!googleClientId || !googleClientSecret) {
      return NextResponse.json(
        { error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.' },
        { status: 500 }
      )
    }
    
    const oauth2Client = new google.auth.OAuth2(
      googleClientId,
      googleClientSecret
    )
    
    // OAuth2 credentials temporarily disabled
    // oauth2Client.setCredentials({
    //   access_token: accessToken
    // })

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