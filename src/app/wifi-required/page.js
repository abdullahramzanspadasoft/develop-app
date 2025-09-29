'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from 'lucide-react'

export default function WiFiRequired() {
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = () => {
    setIsChecking(true)
    
    // Simulate connection check
    setTimeout(() => {
      setIsChecking(false)
      // Reload page to check connection again
      window.location.reload()
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <WifiOff className="h-20 w-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            WiFi Connection Required
          </h1>
          <p className="text-gray-600 mb-6">
            This website can only be accessed through WiFi connection for security reasons.
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm font-medium">
              Mobile data connection detected
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Wifi className="h-4 w-4 mr-3 text-green-500" />
            <span>Connect to your WiFi network</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <WifiOff className="h-4 w-4 mr-3 text-red-500" />
            <span>Disconnect from mobile data</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <AlertTriangle className="h-4 w-4 mr-3 text-amber-500" />
            <span>Ensure stable WiFi connection</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={checkConnection}
            disabled={isChecking}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {isChecking ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Connection Again
              </>
            )}
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Go to Homepage
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>For security reasons, this website requires WiFi connection.</p>
          <p>Please connect to a secure WiFi network to continue.</p>
        </div>
      </div>
    </div>
  )
}
