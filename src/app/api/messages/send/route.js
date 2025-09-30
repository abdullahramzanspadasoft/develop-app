import { NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { email, message, name } = await request.json()

    // Validate input
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Create message record
    const newMessage = await prisma.message.create({
      data: {
        email,
        message,
        name: name || 'Anonymous',
        timestamp: new Date(),
        status: 'unread'
      },
    })

    console.log(`📨 New message received from ${email}: ${message}`)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      messageId: newMessage.id
    })

  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
