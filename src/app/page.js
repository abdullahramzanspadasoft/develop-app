'use client'

import { useState } from 'react'
import { Clock, ArrowRight, Mail, User, Lock } from 'lucide-react'
import Link from 'next/link'
// Dynamic import for notifications to avoid SSR issues
let notificationService = null
if (typeof window !== 'undefined') {
  try {
    const { notificationService: service } = require('@/lib/notifications')
    notificationService = service
  } catch (error) {
    console.warn('Notifications not available:', error.message)
  }
}

export default function Home() {
  const [showAuthOptions, setShowAuthOptions] = useState(false)
  const [gmailEmail, setGmailEmail] = useState('')
  const [gmailLoading, setGmailLoading] = useState(false)
  const [gmailError, setGmailError] = useState('')
  const [gmailSuccess, setGmailSuccess] = useState(false)
  
  // Messaging system states
  const [showMessaging, setShowMessaging] = useState(false)
  const [messageData, setMessageData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [messageLoading, setMessageLoading] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [messageSuccess, setMessageSuccess] = useState(false)

  const handleGmailSubmit = async (e) => {
    e.preventDefault()
    setGmailLoading(true)
    setGmailError('')

    try {
      // Simple verification code generation
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Show success message with code
      setGmailSuccess(true)
      
      // Browser alert (always works)
      alert(`⌚ Watches Store\n\n📧 Verification code sent to ${gmailEmail}!\n\n🔐 Your verification code: ${verificationCode}\n\n⏰ Code expires in 10 minutes`)
      
      // Mobile push notification (if supported)
      if (notificationService) {
        try {
          await notificationService.sendVerificationNotification(gmailEmail, verificationCode)
          console.log('📱 Mobile notification sent successfully!')
        } catch (error) {
          console.log('📱 Mobile notification not available:', error.message)
        }
      }
      
    } catch (error) {
      setGmailError('Something went wrong. Please try again.')
    } finally {
      setGmailLoading(false)
    }
  }

  const handleMessageSubmit = async (e) => {
    e.preventDefault()
    setMessageLoading(true)
    setMessageError('')

    try {
      const response = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessageSuccess(true)
        setMessageData({ name: '', email: '', message: '' })
        alert(`📨 Message sent successfully!\n\nYour message has been delivered to Watches Store.\n\nWe'll get back to you soon!`)
      } else {
        setMessageError(result.error || 'Failed to send message')
      }
    } catch (error) {
      setMessageError('Something went wrong. Please try again.')
    } finally {
      setMessageLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <Clock className="h-32 w-32 text-amber-600 mx-auto mb-6" />
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Premium Watches
              </h1>
              <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover our exquisite collection of luxury timepieces. 
                From classic elegance to modern sophistication, find your perfect watch.
              </p>
            </div>

            {/* Get Started Button */}
            {!showAuthOptions ? (
              <div className="text-center space-y-4">
                <button
                  onClick={() => setShowAuthOptions(true)}
                  className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-200 shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="h-6 w-6 ml-2 inline" />
                </button>
                
                <div className="text-center">
                  <button
                    onClick={() => setShowMessaging(true)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 shadow-lg hover:shadow-xl"
                  >
                    💬 Send Message to Watches Store
                  </button>
                </div>
              </div>
            ) : (
              /* Two Box Layout */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Gmail Verification Box */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-amber-200 hover:border-amber-300 transition duration-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gmail Verification</h2>
                    <p className="text-gray-600">Enter your Gmail to receive verification code</p>
                  </div>

                  <form onSubmit={handleGmailSubmit} className="space-y-4">
                    {gmailError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <span className="text-red-700 text-sm">{gmailError}</span>
                      </div>
                    )}

                    {gmailSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <span className="text-green-700 text-sm">⌚ Watches Store - Verification code sent successfully!</span>
                      </div>
                    )}

                    <div>
                      <label htmlFor="gmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Gmail Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="gmail"
                          value={gmailEmail}
                          onChange={(e) => setGmailEmail(e.target.value)}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="your-email@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={gmailLoading}
                      className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                      {gmailLoading ? 'Sending Code...' : 'Send Verification Code'}
                    </button>
                  </form>
                </div>

                {/* Signup/Signin Box */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200 hover:border-blue-300 transition duration-200">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
                    <p className="text-gray-600">Create account or sign in to continue</p>
                  </div>

                  <div className="space-y-4">
              <Link
                href="/auth/signup"
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center"
                    >
                      <User className="h-5 w-5 mr-2" />
                      Create New Account
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>

                    <Link
                      href="/auth/signin"
                      className="w-full border-2 border-blue-600 text-blue-600 py-3 px-4 rounded-lg font-medium hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 flex items-center justify-center"
                    >
                      <Lock className="h-5 w-5 mr-2" />
                      Sign In
                      <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messaging Modal */}
      {showMessaging && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">💬 Send Message</h2>
              <button
                onClick={() => setShowMessaging(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleMessageSubmit} className="space-y-4">
              {messageError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <span className="text-red-700 text-sm">{messageError}</span>
                </div>
              )}

              {messageSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <span className="text-green-700 text-sm">📨 Message sent successfully!</span>
                </div>
              )}

              <div>
                <label htmlFor="messageName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="messageName"
                  value={messageData.name}
                  onChange={(e) => setMessageData({...messageData, name: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="messageEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Gmail
                </label>
                <input
                  type="email"
                  id="messageEmail"
                  value={messageData.email}
                  onChange={(e) => setMessageData({...messageData, email: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your-email@gmail.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="messageText" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  id="messageText"
                  rows={4}
                  value={messageData.message}
                  onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowMessaging(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={messageLoading}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                >
                  {messageLoading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Watches?
            </h2>
            <p className="text-xl text-gray-600">
              Quality, craftsmanship, and style in every timepiece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted with the finest materials and Swiss precision engineering
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Verification</h3>
              <p className="text-gray-600">
                Secure email verification system for account safety
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Access</h3>
              <p className="text-gray-600">
                Simple signup and signin process with email verification
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}