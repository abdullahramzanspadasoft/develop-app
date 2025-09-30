'use client'

import { useState } from 'react'
import { Mail, Shield, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

export default function GmailVerificationTest() {
  const [step, setStep] = useState('email') // 'email', 'verify', 'success'
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [testCode, setTestCode] = useState('')

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Generate a test code
      const code = String(Math.floor(100000 + Math.random() * 900000))
      setTestCode(code)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(`Test verification code generated: ${code}`)
      setMaskedEmail(email.replace(/(.{2}).*(@.*)/, '$1***$2'))
      setStep('verify')
      setResendCooldown(60)
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (verificationCode === testCode) {
        setSuccess('Gmail address verified successfully!')
        setStep('success')
      } else {
        setAttemptsRemaining(prev => prev - 1)
        if (attemptsRemaining <= 1) {
          throw new Error('Too many attempts. Please try again.')
        }
        throw new Error(`Invalid verification code. ${attemptsRemaining - 1} attempt(s) remaining.`)
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (resendCooldown > 0) return
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Generate new test code
      const code = String(Math.floor(100000 + Math.random() * 900000))
      setTestCode(code)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(`New test verification code: ${code}`)
      setResendCooldown(60)
      setAttemptsRemaining(3)
      
      // Start cooldown timer
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep('email')
    setEmail('')
    setVerificationCode('')
    setError('')
    setSuccess('')
    setMaskedEmail('')
    setAttemptsRemaining(3)
    setResendCooldown(0)
    setTestCode('')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Gmail Verification (Test Mode)</h2>
      </div>

      {/* Test Mode Notice */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-900">Test Mode</h4>
            <p className="text-sm text-yellow-700 mt-1">
              This is a test version. The verification code will be displayed here instead of being sent via email.
              For real email sending, configure SMTP settings in .env.local
            </p>
          </div>
        </div>
      </div>

      {/* Step 1: Email Input */}
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your Gmail address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll generate a 6‑digit verification code for testing.
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            <span>{loading ? 'Generating...' : 'Generate Test Code'}</span>
          </button>
        </form>
      )}

      {/* Step 2: Verification Code */}
      {step === 'verify' && (
        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Test verification code generated
            </h3>
            <p className="text-gray-600 mb-4">
              Enter the code below to continue.
            </p>
            <p className="text-sm text-gray-500">
              Test for: <span className="font-medium">{maskedEmail}</span>
            </p>
          </div>

          {/* Show the test code */}
          {testCode && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-blue-700 mb-2">Test Code (for testing only):</p>
                <div className="text-2xl font-mono font-bold text-blue-900 tracking-widest">
                  {testCode}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg tracking-widest"
            />
            {attemptsRemaining < 3 && (
              <p className="text-xs text-orange-600 mt-1">
                {attemptsRemaining} attempt(s) remaining
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600 text-sm">{success}</span>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <span>{loading ? 'Verifying...' : 'Verify Code'}</span>
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading || resendCooldown > 0}
                className="text-green-600 hover:text-green-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? (
                  <span className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Resend in {resendCooldown}s</span>
                  </span>
                ) : (
                  "Generate new test code"
                )}
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="text-gray-600 hover:text-gray-700"
              >
                Change email
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Step 3: Success */}
      {step === 'success' && (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-900">
            Gmail Verified Successfully! (Test Mode)
          </h3>
          <p className="text-gray-600">
            Your Gmail address has been verified in test mode.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>Test Verified: {maskedEmail}</span>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Test Another Email
          </button>
        </div>
      )}
    </div>
  )
}
