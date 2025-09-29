'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react'

export default function WiFiRestriction() {
  const [isWiFiConnected, setIsWiFiConnected] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkConnection = () => {
      // Check if user is on WiFi
      if (navigator.connection) {
        const connection = navigator.connection
        const isWiFi = connection.type === 'wifi' || 
                       connection.effectiveType === '4g' || 
                       connection.effectiveType === '3g'
        
        setIsWiFiConnected(isWiFi)
        setIsChecking(false)
      } else {
        // Fallback: Check if user is on local network (WiFi)
        const isLocalNetwork = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1' ||
                              window.location.hostname.includes('192.168') ||
                              window.location.hostname.includes('10.0') ||
                              window.location.hostname.includes('172.')
        
        setIsWiFiConnected(isLocalNetwork)
        setIsChecking(false)
      }
    }

    // Check connection immediately
    checkConnection()

    // Check connection every 5 seconds
    const interval = setInterval(checkConnection, 5000)

    // Listen for connection changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', checkConnection)
    }

    return () => {
      clearInterval(interval)
      if (navigator.connection) {
        navigator.connection.removeEventListener('change', checkConnection)
      }
    }
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking connection...</p>
        </div>
      </div>
    )
  }

  if (!isWiFiConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <WifiOff className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              WiFi Connection Required
            </h1>
            <p className="text-gray-600 mb-6">
              This website can only be accessed through WiFi connection for security reasons.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">
                Please connect to WiFi to continue
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <Wifi className="h-4 w-4 mr-2" />
              Connect to your WiFi network
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <WifiOff className="h-4 w-4 mr-2" />
              Disconnect from mobile data
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Check Connection Again
          </button>
        </div>
      </div>
    )
  }

  return null
}
