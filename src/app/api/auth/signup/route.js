import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Dynamic import to avoid build-time issues
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Ye email pehle se register hai. Different email use karein ya signin karein.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (simple version - no email verification)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: true, // Skip email verification for simplicity
      },
    })

    return NextResponse.json(
      { 
        message: 'User created successfully!', 
        userId: user.id,
        email: user.email,
        name: user.name
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}