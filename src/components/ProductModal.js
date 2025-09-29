'use client'

import { useState } from 'react'
import { X, Star, Heart, ShoppingCart, Clock, Shield, Check } from 'lucide-react'

export default function ProductModal({ watch, isOpen, onClose, onAddToCart }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  if (!isOpen || !watch) return null

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const discountPercentage = Math.round(((watch.originalPrice - watch.price) / watch.originalPrice) * 100)

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    try {
      await onAddToCart(watch)
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-amber-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2 p-6">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
              {watch.image ? (
                <img 
                  src={watch.image} 
                  alt={watch.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-48 h-48 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
                  <span className="text-8xl">⌚</span>
                </div>
              )}
            </div>
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                -{discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2 p-6">
            {/* Brand */}
            <p className="text-sm text-gray-500 mb-2">{watch.brand}</p>
            
            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{watch.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(watch.rating)
                        ? 'text-amber-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-3">
                {watch.rating} ({watch.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(watch.price)}
                </span>
                {watch.originalPrice > watch.price && (
                  <span className="text-2xl text-gray-500 line-through">
                    {formatPrice(watch.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {watch.description}
            </p>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {watch.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {watch.inStock ? (
                <div className="flex items-center text-green-600">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">In Stock - Ready to Ship</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="h-5 w-5 mr-2" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => window.open('https://wa.me/03098789014', '_blank')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <div className="flex items-center">
                  <span className="mr-2">📱</span>
                  Payment Method
                </div>
              </button>
              
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                }`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
