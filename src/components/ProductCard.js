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
    <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group w-full border border-gray-100 hover:border-amber-200">
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gray-200 flex items-center justify-center p-8 group-hover:bg-gray-300 transition-all duration-500">
          {watch.image ? (
            <img 
              src={watch.image} 
              alt={watch.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500 text-4xl">⌚</span>
            </div>
          )}
        </div>
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
            -{discountPercentage}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 shadow-lg ${
            isLiked 
              ? 'bg-red-500 text-white scale-110' 
              : 'bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110'
          }`}
        >
          <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button */}
        <button
          onClick={() => onViewDetails(watch)}
          className="absolute bottom-4 right-4 p-2.5 bg-white/90 text-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-amber-500 hover:text-white hover:scale-110 shadow-lg"
        >
          <Eye className="h-5 w-5" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{watch.brand}</p>
        
        {/* Product Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
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
        <div className="mb-5 sm:mb-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl sm:text-3xl font-bold text-amber-600">
              {formatPrice(watch.price)}
            </span>
            {watch.originalPrice > watch.price && (
              <span className="text-lg sm:text-xl text-gray-500 line-through">
                {formatPrice(watch.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-5 sm:mb-6">
          <div className="flex flex-wrap gap-2">
            {watch.features.slice(0, 2).map((feature, index) => (
              <span
                key={index}
                className="text-xs bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full font-medium"
              >
                {feature}
              </span>
            ))}
            {watch.features.length > 2 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                +{watch.features.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Stock Status */}
        <div className="mb-5 sm:mb-6">
          {watch.inStock ? (
            <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1.5 rounded-full">✓ In Stock</span>
          ) : (
            <span className="text-sm text-red-600 font-semibold bg-red-50 px-3 py-1.5 rounded-full">✗ Out of Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleAddToCart}
            disabled={!watch.inStock || isAddingToCart}
            className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-5 sm:px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
          >
            {isAddingToCart ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                <span className="text-sm sm:text-base">Adding...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="text-sm sm:text-base">Add to Cart</span>
              </div>
            )}
          </button>
          
          <button
            onClick={() => onViewDetails(watch)}
            className="px-5 sm:px-6 py-3.5 border-2 border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg hover:scale-105"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
