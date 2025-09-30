import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email aur password dono required hain' },
        { status: 400 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Check if user exists with this exact email
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Ye email database mein exist nahi karta' },
        { status: 401 }
      )
    }

    // Verify password for this specific email
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Is email ke liye galat password hai. Sahi password enter karein.' },
        { status: 401 }
      )
    }

    // Success - return user data
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })

  } catch (error) {
    console.error('Database error during authentication:', error)
    return NextResponse.json(
      { error: 'Database connection error' },
      { status: 500 }
    )
  }
}
