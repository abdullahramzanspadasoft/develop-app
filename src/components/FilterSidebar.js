'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-full sm:w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6">
          {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => toggleSection('category')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              Categories
              {expandedSections.category ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.category && (
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              Price Range
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-2">
                {priceRanges.map((range) => (
                  <label
                    key={range.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      value={range.id}
                      checked={selectedPriceRange === range.id}
                      onChange={(e) => onPriceRangeChange(e.target.value)}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {range.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Features Filter */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => toggleSection('features')}
              className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3"
            >
              Features
              {expandedSections.features ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {expandedSections.features && (
              <div className="space-y-2">
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
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {feature}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              onCategoryChange('all')
              onPriceRangeChange('all')
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  )
}
