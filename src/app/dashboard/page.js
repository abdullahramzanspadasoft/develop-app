'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { 
  User, 
  LogOut, 
  Clock, 
  ShoppingCart, 
  Filter, 
  Search, 
  Grid, 
  List,
  Heart,
  Star,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import FilterSidebar from '@/components/FilterSidebar'
import ShoppingCartComponent from '@/components/ShoppingCart'
import ProductModal from '@/components/ProductModal'
import GmailVerificationClean from '@/components/GmailVerificationClean'
import { watches, categories, priceRanges } from '@/data/watches'

export default function Dashboard() {
  const router = useRouter()
  const [localStorageData, setLocalStorageData] = useState({
    email: '',
    name: '',
    userId: ''
  })
  const [filteredWatches, setFilteredWatches] = useState(watches)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [favorites, setFavorites] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [showGmailVerification, setShowGmailVerification] = useState(false)

  useEffect(() => {
    // Get data from localStorage
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('userEmail') || ''
      const storedName = localStorage.getItem('userName') || ''
      const storedUserId = localStorage.getItem('userId') || ''
      
      if (!storedEmail) {
        router.push('/auth/signin')
        return
      }
      
      setLocalStorageData({
        email: storedEmail,
        name: storedName,
        userId: storedUserId
      })

      // Load cart and favorites from localStorage
      const savedCart = localStorage.getItem('cartItems')
      const savedFavorites = localStorage.getItem('favorites')
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    }
  }, [router])

  // Filter and sort watches
  useEffect(() => {
    let filtered = [...watches]

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(watch => watch.category === selectedCategory)
    }

    // Price range filter
    if (selectedPriceRange !== 'all') {
      const range = priceRanges.find(r => r.id === selectedPriceRange)
      if (range) {
        filtered = filtered.filter(watch => 
          watch.price >= range.min && watch.price <= range.max
        )
      }
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(watch => 
        watch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        watch.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredWatches(filtered)
  }, [selectedCategory, selectedPriceRange, searchQuery, sortBy])

  const handleSignOut = () => {
    // Clear localStorage on signout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userName')
      localStorage.removeItem('userId')
      localStorage.removeItem('cartItems')
      localStorage.removeItem('favorites')
    }
    router.push('/auth/signin')
  }

  const handleAddToCart = (watch) => {
    const existingItem = cartItems.find(item => item.id === watch.id)
    
    if (existingItem) {
      const updatedCart = cartItems.map(item =>
        item.id === watch.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      setCartItems(updatedCart)
      localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    } else {
      const newItem = { ...watch, quantity: 1 }
      const updatedCart = [...cartItems, newItem]
      setCartItems(updatedCart)
      localStorage.setItem('cartItems', JSON.stringify(updatedCart))
    }
  }

  const handleUpdateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedCart)
    localStorage.setItem('cartItems', JSON.stringify(updatedCart))
  }

  const handleViewDetails = (watch) => {
    setSelectedProduct(watch)
    setIsProductModalOpen(true)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-4 space-y-3 sm:space-y-0">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-amber-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Watch Store</h1>
            </div>
            
            {/* Search Bar */}
            <div className="w-full sm:flex-1 sm:max-w-lg sm:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search watches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Gmail Verification Button */}
              <button
                onClick={() => setShowGmailVerification(!showGmailVerification)}
                className={`p-2 transition-colors ${
                  showGmailVerification 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-600 hover:text-green-600'
                }`}
                title="Gmail Verification"
              >
                <Mail className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Welcome, {localStorageData.name || localStorageData.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                >
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Filter Sidebar */}
        <FilterSidebar
          categories={categories}
          priceRanges={priceRanges}
          selectedCategory={selectedCategory}
          selectedPriceRange={selectedPriceRange}
          onCategoryChange={setSelectedCategory}
          onPriceRangeChange={setSelectedPriceRange}
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 lg:pl-2">
          <div className="p-3 sm:p-6 lg:p-8">
            
            {/* Gmail Verification Section */}
            {showGmailVerification && (
              <div className="mb-8">
                <GmailVerificationClean />
              </div>
            )}
            
            {/* Controls */}
            <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing {filteredWatches.length} of {watches.length} watches
                  </div>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-amber-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <List className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredWatches.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No watches found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={`grid gap-6 sm:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2' 
                  : 'grid-cols-1'
              }`}>
                {filteredWatches.map((watch) => (
                  <ProductCard
                    key={watch.id}
                    watch={watch}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
        </div>

      {/* Shopping Cart */}
      <ShoppingCartComponent
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* Product Modal */}
      <ProductModal
        watch={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
