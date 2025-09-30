import { NextResponse } from 'next/server'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    // Dynamic import to avoid build-time issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Get all messages (admin view)
    const messages = await prisma.message.findMany({
      orderBy: {
        timestamp: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      messages: messages
    })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
