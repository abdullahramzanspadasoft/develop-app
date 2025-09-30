'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Mail, User, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AdminMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages/get')
      const result = await response.json()
      
      if (result.success) {
        setMessages(result.messages)
      } else {
        setError('Failed to fetch messages')
      }
    } catch (error) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'read':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'replied':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'unread':
        return 'bg-red-50 border-red-200'
      case 'read':
        return 'bg-blue-50 border-blue-200'
      case 'replied':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <MessageCircle className="h-8 w-8 text-amber-600 mr-3" />
              Watches Store - Messages
            </h1>
            <p className="text-gray-600 mt-1">All messages from customers</p>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="p-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                <p className="text-gray-500">Messages from customers will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`border rounded-lg p-6 ${getStatusColor(message.status)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(message.status)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            {message.name || 'Anonymous'}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-1" />
                            {message.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(message.timestamp)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          message.status === 'unread' ? 'bg-red-100 text-red-800' :
                          message.status === 'read' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {message.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-800 leading-relaxed">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
