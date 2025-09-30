'use client'

import { useState } from 'react'
import { Mail, Shield, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react'

export default function GmailVerification() {
  const [step, setStep] = useState('email') // 'email', 'verify', 'success'
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const [attemptsRemaining, setAttemptsRemaining] = useState(3)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/gmail/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setSuccess(data.message)
      setMaskedEmail(data.maskedEmail)
      setStep('verify')
      setResendCooldown(60) // 60 seconds cooldown
      
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
      const response = await fetch('/api/gmail/verify/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode })
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.attemptsRemaining) {
          setAttemptsRemaining(data.attemptsRemaining)
        }
        throw new Error(data.error || 'Failed to verify code')
      }

      setSuccess(data.message)
      setStep('success')

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
      const response = await fetch('/api/gmail/verify/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code')
      }

      setSuccess('A new verification code has been sent to your Gmail.')
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
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-900">Gmail Verification</h2>
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
              We'll send a 6‑digit verification code to your Gmail. Please check your inbox (and spam).
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
            <span>{loading ? 'Sending...' : 'Send verification code'}</span>
          </button>
        </form>
      )}

      {/* Step 2: Verification Code */}
      {step === 'verify' && (
        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              A verification code has been sent to your Gmail
            </h3>
            <p className="text-gray-600 mb-4">
              Enter it below to continue.
            </p>
            <p className="text-sm text-gray-500">
              Sent to: <span className="font-medium">{maskedEmail}</span>
            </p>
          </div>

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
                  "Didn't receive? Resend code"
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
            Gmail Verified Successfully!
          </h3>
          <p className="text-gray-600">
            Your Gmail address has been verified and you can now access Gmail features.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Mail className="h-4 w-4" />
            <span>Verified: {maskedEmail}</span>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Verify Another Email
          </button>
        </div>
      )}
    </div>
  )
}
