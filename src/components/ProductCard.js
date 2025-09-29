'use client'

import { useState } from 'react'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'

export default function ProductCard({ watch, onAddToCart, onViewDetails }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

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

  const discountPercentage = Math.round(((watch.originalPrice - watch.price) / watch.originalPrice) * 100)

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group w-full">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
          <div className="w-40 h-40 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
            <span className="text-5xl">⌚</span>
          </div>
        </div>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors duration-200 ${
            isLiked 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => onViewDetails(watch)}
          className="absolute bottom-3 right-3 p-2 bg-white/80 text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-amber-500 hover:text-white"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{watch.brand}</p>
        
        {/* Product Name */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 line-clamp-2">
          {watch.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-3 sm:mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(watch.rating)
                    ? 'text-amber-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            {watch.rating} ({watch.reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mb-4 sm:mb-5">
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl font-bold text-gray-900">
              {formatPrice(watch.price)}
            </span>
            {watch.originalPrice > watch.price && (
              <span className="text-base sm:text-lg text-gray-500 line-through">
                {formatPrice(watch.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-4 sm:mb-5">
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {watch.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
              >
                {feature}
              </span>
            ))}
            {watch.features.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{watch.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-4 sm:mb-5">
          {watch.inStock ? (
            <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-medium">✗ Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={handleAddToCart}
            disabled={!watch.inStock || isAddingToCart}
            className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200 flex items-center justify-center"
          >
            {isAddingToCart ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                <span className="text-xs sm:text-sm">Adding...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">Add to Cart</span>
              </div>
            )}
          </button>
          
          <button
            onClick={() => onViewDetails(watch)}
            className="px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
          >
            View
          </button>
        </div>
      </div>
    </div>
  )
}
