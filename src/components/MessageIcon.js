'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'

export default function MessageIcon() {
  const [isHovered, setIsHovered] = useState(false)

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/03098789014', '_blank')
  }

  const handleCallClick = () => {
    window.open('tel:03098789014', '_blank')
  }

  return (
    <div className="relative">
      {/* Floating Message Button */}
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Tooltip */}
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Quick Actions (Optional - can be added later) */}
      <div className="absolute bottom-16 right-0 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={handleCallClick}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
          title="Call us"
        >
          <Phone className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
