'use client'

import { AlertCircle, ExternalLink } from 'lucide-react'

export default function GoogleAuthError() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Google OAuth Not Configured
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Google authentication is not set up yet. To enable Google sign-in:
          </p>
          <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1 mb-3">
            <li>Get Google OAuth credentials from Google Cloud Console</li>
            <li>Update your .env.local file with GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET</li>
            <li>Set NEXT_PUBLIC_GOOGLE_ENABLED=true in .env.local</li>
            <li>Restart your development server</li>
          </ol>
          <a
            href="/GOOGLE_SETUP.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-yellow-800 hover:text-yellow-900"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Setup Guide
          </a>
        </div>
      </div>
    </div>
  )
}
