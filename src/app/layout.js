import { Inter } from 'next/font/google'
import './globals.css'
import WiFiRestriction from '@/components/WiFiRestriction'
import ChatWidget from '@/components/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Watch Store - Premium Timepieces',
  description: 'Discover our exquisite collection of luxury timepieces. From classic elegance to modern sophistication, find your perfect watch.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WiFiRestriction />
        {/* Chat Widget */}
        <ChatWidget />
        {children}
      </body>
    </html>
  )
}
