'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, Mail, Calendar, LogOut, Database, Shield, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function Profile() {
  const router = useRouter()
  const [localStorageData, setLocalStorageData] = useState({
    email: '',
    name: '',
    userId: ''
  })

  useEffect(() => {
    // Get data from localStorage
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('userEmail') || ''
      const storedName = localStorage.getItem('userName') || ''
      const storedUserId = localStorage.getItem('userId') || ''
      
      if (!storedEmail) {
        router.push('/auth/signin')
        return
      }
      
      setLocalStorageData({
        email: storedEmail,
        name: storedName,
        userId: storedUserId
      })
    }
  }, [router])

  const handleSignOut = () => {
    // Clear localStorage on signout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('userId')
    }
    router.push('/auth/signin')
  }

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('userId')
      setLocalStorageData({
        email: '',
        name: '',
        userId: ''
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              >
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Profile Header */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {localStorageData.name || 'User Profile'}
                  </h2>
                  <p className="text-gray-600">
                    Manage your account information and preferences
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition duration-200">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Personal Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {localStorageData.name || 'Not provided'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {localStorageData.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">User ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono">
                      {localStorageData.userId || 'Not available'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* LocalStorage Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-green-600" />
                  LocalStorage Data
                </h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Email:</strong> {localStorageData.email || 'Not stored'}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Name:</strong> {localStorageData.name || 'Not stored'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">
                      <strong>User ID:</strong> {localStorageData.userId || 'Not stored'}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearLocalStorage}
                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear LocalStorage
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Security Information */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-yellow-600" />
                Security & Session Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Session Status</dt>
                  <dd className="mt-1 text-sm text-green-600 font-medium">
                    ✅ Active Session
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Authentication Method</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Email & Password
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Data Storage</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Database + LocalStorage
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date().toLocaleString()}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
