export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Premium Watches
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Discover our exquisite collection of luxury timepieces.
        </p>
        <button className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-xl hover:bg-amber-700">
          Get Started
        </button>
      </div>
    </div>
  )
}