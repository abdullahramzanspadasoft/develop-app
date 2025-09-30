// Email Setup Test Script
// Run this to test your email configuration

const nodemailer = require('nodemailer');

async function testEmailConfig() {
  console.log('🔧 Testing Email Configuration...\n');
  
  // Check environment variables
  const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Missing environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n📝 Please add these to your .env.local file:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=your-email@gmail.com');
    console.log('SMTP_PASS=your-16-digit-app-password');
    return;
  }
  
  console.log('✅ Environment variables found');
  console.log(`   SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`   SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`   SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   SMTP_PASS: ${'*'.repeat(process.env.SMTP_PASS.length)}`);
  
  // Test transporter
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  try {
    console.log('\n🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');
    
    console.log('\n📧 Testing email send...');
    const testEmail = await transporter.sendMail({
      from: `"Watch Store Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: 'Gmail Verification Test',
      text: 'This is a test email from Watch Store verification system.',
      html: '<h2>Gmail Verification Test</h2><p>This is a test email from Watch Store verification system.</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${testEmail.messageId}`);
    console.log('\n🎉 Email configuration is working correctly!');
    console.log('   Check your inbox for the test email.');
    
  } catch (error) {
    console.log('❌ Email configuration error:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Solution: Check your Gmail App Password');
      console.log('   1. Go to Google Account → Security');
      console.log('   2. Enable 2-Step Verification');
      console.log('   3. Generate App Password for "Mail"');
      console.log('   4. Use the 16-digit password in SMTP_PASS');
    }
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testEmailConfig();
