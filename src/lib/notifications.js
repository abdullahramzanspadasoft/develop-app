// Mobile Push Notifications Service
class NotificationService {
  constructor() {
    // Check if we're in browser environment
    this.isSupported = typeof window !== 'undefined' && 'Notification' in window
    this.permission = typeof window !== 'undefined' ? Notification.permission : 'default'
  }

  // Request notification permission
  async requestPermission() {
    if (typeof window === 'undefined') {
      return false
    }

    if (!this.isSupported) {
      console.log('Notifications not supported')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      console.log('Notifications denied by user')
      return false
    }

    const permission = await Notification.requestPermission()
    this.permission = permission
    return permission === 'granted'
  }

  // Send notification
  async sendNotification(title, options = {}) {
    if (typeof window === 'undefined') {
      return false
    }

    if (!this.isSupported || this.permission !== 'granted') {
      console.log('Notifications not available')
      return false
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options
    })

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)

    return notification
  }

  // Send verification code notification
  async sendVerificationNotification(email, code) {
    return this.sendNotification('⌚ Watches Store - Verification Code', {
      body: `Your verification code: ${code}\nEmail: ${email}\nExpires in 10 minutes`,
      tag: 'verification',
      requireInteraction: true
    })
  }

  // Send welcome notification
  async sendWelcomeNotification(name) {
    return this.sendNotification('🎉 Welcome to Watches Store!', {
      body: `Hello ${name}! Your account has been created successfully.`,
      tag: 'welcome'
    })
  }

  // Send order notification
  async sendOrderNotification(orderId) {
    return this.sendNotification('📦 Order Confirmed', {
      body: `Your order #${orderId} has been confirmed. We'll notify you when it ships.`,
      tag: 'order'
    })
  }
}

// Export singleton instance
export const notificationService = new NotificationService()

// Auto-request permission on load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    notificationService.requestPermission()
  })
}
