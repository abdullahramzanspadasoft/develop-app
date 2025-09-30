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

export async function GET(request) {
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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const maxResults = searchParams.get('maxResults') || '10'
    const query = searchParams.get('query') || ''
    const account = searchParams.get('account') || ''

    // Build search query to filter by specific Gmail account
    let searchQuery = query
    if (account) {
      // Search for messages from or to the specified account
      const accountQuery = `(from:${account} OR to:${account})`
      searchQuery = searchQuery ? `${searchQuery} ${accountQuery}` : accountQuery
    }

    // Fetch messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: parseInt(maxResults),
      q: searchQuery
    })

    const messages = response.data.messages || []

    // Get detailed information for each message
    const detailedMessages = await Promise.all(
      messages.slice(0, 10).map(async (message) => {
        try {
          const messageDetails = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          })

          const headers = messageDetails.data.payload.headers
          const getHeader = (name) => headers.find(h => h.name === name)?.value || ''

          return {
            id: message.id,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            to: getHeader('To'),
            date: getHeader('Date'),
            snippet: messageDetails.data.snippet,
            threadId: messageDetails.data.threadId
          }
        } catch (error) {
          console.error('Error fetching message details:', error)
          return null
        }
      })
    )

    // Filter out null results
    const validMessages = detailedMessages.filter(msg => msg !== null)

    return NextResponse.json({
      messages: validMessages,
      total: response.data.resultSizeEstimate,
      account: account || 'all'
    })

  } catch (error) {
    console.error('Gmail API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Gmail messages' },
      { status: 500 }
    )
  }
}
