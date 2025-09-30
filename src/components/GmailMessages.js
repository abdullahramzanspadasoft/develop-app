'use client'

import { useState, useEffect } from 'react'
import { Mail, Clock, User, Search, RefreshCw, ExternalLink, Plus } from 'lucide-react'
import GmailCompose from './GmailCompose'

export default function GmailMessages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)
  const [gmailAccount, setGmailAccount] = useState('')
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  const fetchMessages = async (query = '', account = '') => {
    setLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (query) params.append('query', query)
      if (account) params.append('account', account)
      params.append('maxResults', '20')
      
      const response = await fetch(`/api/gmail/messages?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }
      
      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching Gmail messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (gmailAccount) {
      fetchMessages(searchQuery, gmailAccount)
    }
  }, [gmailAccount])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchMessages(searchQuery, gmailAccount)
  }

  const handleGmailAccountChange = (e) => {
    setGmailAccount(e.target.value)
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Mail className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Gmail Messages</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Compose</span>
          </button>
          <button
            onClick={() => fetchMessages(searchQuery, gmailAccount)}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Gmail Account Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gmail Account to Fetch Messages From
        </label>
        <div className="flex space-x-2">
          <input
            type="email"
            placeholder="Enter Gmail address (e.g., user@gmail.com)"
            value={gmailAccount}
            onChange={handleGmailAccountChange}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => fetchMessages(searchQuery, gmailAccount)}
            disabled={!gmailAccount || loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Fetch Messages
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Enter the Gmail address you want to fetch messages from
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search Gmail messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </form>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-1">
            Make sure you're signed in with Google and have granted Gmail permissions.
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
          <span className="ml-2 text-gray-600">Loading messages...</span>
        </div>
      )}

      {/* Messages List */}
      {!loading && !error && (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
              <p className="text-gray-500">
                {searchQuery ? 'Try adjusting your search terms.' : 'Enter a Gmail address above to fetch messages.'}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {message.from}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {message.subject || 'No Subject'}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {truncateText(message.snippet || 'No preview available')}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(message.date)}</span>
                      </div>
                      {message.to && (
                        <div className="flex items-center space-x-1">
                          <span>To: {message.to}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${message.id}`, '_blank')}
                    className="ml-4 p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Open in Gmail"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Connection Notice */}
      {!loading && !error && messages.length === 0 && !gmailAccount && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">Connect Gmail</h4>
              <p className="text-sm text-blue-700 mt-1">
                Enter a Gmail address above to fetch messages from that account. Make sure you're signed in with Google and have granted Gmail permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gmail Compose Modal */}
      <GmailCompose 
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  )
}