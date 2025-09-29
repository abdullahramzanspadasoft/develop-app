import { Clock, ArrowRight, Star, Shield, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <Clock className="h-32 w-32 text-amber-600 mx-auto mb-6" />
              <h1 className="text-6xl font-bold text-gray-900 mb-6">
                Premium Watches
              </h1>
              <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Discover our exquisite collection of luxury timepieces. 
                From classic elegance to modern sophistication, find your perfect watch.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag className="mr-3 h-6 w-6" />
                Shop Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 border-2 border-amber-600 text-lg font-medium rounded-xl text-amber-600 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-200"
              >
                Create Account
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Watches?
            </h2>
            <p className="text-xl text-gray-600">
              Quality, craftsmanship, and style in every timepiece
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted with the finest materials and Swiss precision engineering
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Guarantee</h3>
              <p className="text-gray-600">
                Every watch comes with a certificate of authenticity and warranty
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Timeless Design</h3>
              <p className="text-gray-600">
                Classic and contemporary styles that never go out of fashion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Watch?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of satisfied customers who trust our quality and service
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-amber-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-200"
            >
              <ShoppingBag className="mr-3 h-6 w-6" />
              Browse Collection
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-xl text-white hover:bg-white hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition duration-200"
            >
              Create Account
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
