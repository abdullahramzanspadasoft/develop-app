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

export async function GET(request) {
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
