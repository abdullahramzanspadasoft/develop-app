// Test user creation script
// Run this with: node test-user.js

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('test123', 12)
    
    // Create test user
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
      },
    })
    
    console.log('✅ Test user created successfully!')
    console.log('📧 Email: test@example.com')
    console.log('🔑 Password: test123')
    console.log('👤 User ID:', user.id)
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️ Test user already exists!')
      console.log('📧 Email: test@example.com')
      console.log('🔑 Password: test123')
    } else {
      console.error('❌ Error creating test user:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
