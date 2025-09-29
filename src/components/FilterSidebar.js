'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp, Sparkles, Zap, Star } from 'lucide-react'

export default function FilterSidebar({ 
  categories, 
  priceRanges, 
  selectedCategory, 
  selectedPriceRange, 
  onCategoryChange, 
  onPriceRangeChange,
  isOpen,
  onClose 
}) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    features: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-23 left-0 h-[calc(100vh-5rem)] w-full sm:w-80 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 shadow-2xl z-30 transform transition-all duration-500 ease-out border-r border-amber-200/50 overflow-y-auto backdrop-blur-sm scrollbar-hide
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-300/20 to-orange-300/20 rounded-full blur-xl"></div>
        
        <div className="relative p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-amber-800 bg-clip-text text-transparent">Smart Filters</h2>
                <p className="text-xs text-gray-500">Refine your search</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-600 hover:text-red-600" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4 p-4 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-xl hover:from-amber-200/80 hover:to-orange-200/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-amber-200/50"
            >
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-amber-600 mr-3" />
                <span className="text-lg">Categories</span>
              </div>
              {expandedSections.category ? (
                <ChevronUp className="h-5 w-5 text-amber-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-amber-600" />
              )}
            </button>
            
            {expandedSections.category && (
              <div className="space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                      selectedCategory === category.id 
                        ? 'bg-gradient-to-r from-amber-200/90 to-orange-200/90 border-2 border-amber-400 shadow-lg transform scale-[1.02]' 
                        : 'bg-white/80 border border-gray-200 hover:bg-amber-50/80 hover:border-amber-300 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span className={`ml-4 text-sm font-semibold ${
                        selectedCategory === category.id ? 'text-amber-900' : 'text-gray-700 group-hover:text-amber-800'
                      }`}>
                        {category.name}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-amber-300 text-amber-900 shadow-md' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-amber-200 group-hover:text-amber-800'
                    }`}>
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4 p-4 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-xl hover:from-amber-200/80 hover:to-orange-200/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-amber-200/50"
            >
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-600 mr-3" />
                <span className="text-lg">Price Range</span>
              </div>
              {expandedSections.price ? (
                <ChevronUp className="h-5 w-5 text-amber-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-amber-600" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 group ${
                      selectedPriceRange === range.id 
                        ? 'bg-gradient-to-r from-amber-200/90 to-orange-200/90 border-2 border-amber-400 shadow-lg transform scale-[1.02]' 
                        : 'bg-white/80 border border-gray-200 hover:bg-amber-50/80 hover:border-amber-300 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.id}
                      checked={selectedPriceRange === range.id}
                      onChange={(e) => onPriceRangeChange(e.target.value)}
                      className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className={`ml-4 text-sm font-semibold ${
                      selectedPriceRange === range.id ? 'text-amber-900' : 'text-gray-700 group-hover:text-amber-800'
                    }`}>
                      {range.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Features Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection('features')}
              className="flex items-center justify-between w-full text-left font-bold text-gray-900 mb-4 p-4 bg-gradient-to-r from-amber-100/80 to-orange-100/80 rounded-xl hover:from-amber-200/80 hover:to-orange-200/80 transition-all duration-300 shadow-lg hover:shadow-xl border border-amber-200/50"
            >
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-amber-600 mr-3" />
                <span className="text-lg">Features</span>
              </div>
              {expandedSections.features ? (
                <ChevronUp className="h-5 w-5 text-amber-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-amber-600" />
              )}
            </button>
            
            {expandedSections.features && (
              <div className="space-y-3">
                {[
                  'Water Resistant',
                  'Swiss Movement',
                  'Chronograph',
                  'GPS',
                  'Bluetooth',
                  'Diamond Accents',
                  'Leather Strap',
                  'Stainless Steel'
                ].map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center p-4 rounded-xl bg-white/80 border border-gray-200 hover:bg-amber-50/80 hover:border-amber-300 hover:shadow-md hover:scale-[1.01] cursor-pointer transition-all duration-300 group"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="ml-4 text-sm font-semibold text-gray-700 group-hover:text-amber-800">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <div className="mt-8 pt-6 border-t border-amber-200/50">
            <button
              onClick={() => {
                onCategoryChange('all')
                onPriceRangeChange('all')
              }}
              className="w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:from-gray-200 hover:via-gray-300 hover:to-gray-400 text-gray-800 py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] border border-gray-300"
            >
              <div className="flex items-center justify-center">
                <X className="h-5 w-5 mr-2" />
                Clear All Filters
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
