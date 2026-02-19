'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  TrendingDown, 
  Store, 
  Star, 
  ShoppingCart, 
  Filter,
  ChevronDown,
  Heart,
  Share2,
  Zap,
  Package,
  Truck,
  ArrowUpRight
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

export default function PriceComparator() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [favorites, setFavorites] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)

  const categories = ['all', 'Electronics', 'Fashion', 'Home', 'Gaming']

  useEffect(() => {
    fetchProducts()
  }, [searchQuery, selectedCategory, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        category: selectedCategory,
        sort: sortBy
      })
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
    setLoading(false)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass sticky top-0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">PriceWise</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors">
                <TrendingDown className="w-4 h-4" />
                <span>Price Drops</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-white cursor-pointer transition-colors">
                <Heart className="w-4 h-4" />
                <span>Favorites ({favorites.length})</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Search Section */}
      <section className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find the <span className="gradient-text">Best Deals</span>
            <br />Across All Stores
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Compare prices in real-time, track price history, and never overpay again.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30"></div>
            <div className="relative glass rounded-2xl p-2 flex items-center">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search products, brands, or categories..."
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-lg placeholder-gray-500 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:scale-105">
                Search
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full capitalize transition-all ${
                  selectedCategory === cat 
                    ? 'bg-white text-black font-medium' 
                    : 'glass glass-hover text-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex justify-center">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="glass appearance-none px-6 py-2 pr-10 rounded-full text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass rounded-2xl h-96 animate-pulse bg-white/5"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onViewDetails={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  )
}

function ProductCard({ product, isFavorite, onToggleFavorite, onViewDetails }) {
  return (
    <div className="glass rounded-2xl overflow-hidden glass-hover transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
        {product.savings > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            Save ${product.savings}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">{product.category}</span>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">{product.bestStore.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">
          {product.name}
        </h3>

        {/* Price Comparison */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400 text-sm">Best Price</span>
            <span className="text-2xl font-bold text-green-400">${product.bestPrice}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">vs Highest</span>
            <span className="text-gray-400 line-through">${product.worstPrice}</span>
          </div>
        </div>

        {/* Store Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.stores.slice(0, 3).map((store, idx) => (
            <span 
              key={idx}
              className={`text-xs px-2 py-1 rounded-md ${
                store.price === product.bestPrice 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              {store.name}
            </span>
          ))}
          {product.stores.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-400">
              +{product.stores.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button 
            onClick={onViewDetails}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
          >
            <span>Compare Prices</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href={product.bestStore.url}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Now</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function ProductModal({ product, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="glass rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold gradient-text">{product.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          {/* Left: Image & Chart */}
          <div className="space-y-6">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-64 object-cover rounded-2xl"
            />
            
            {/* Price History Chart */}
            <div className="glass rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <TrendingDown className="w-5 h-5 text-blue-400" />
                <span>Price History (6 Months)</span>
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={product.priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px'
                      }}
                      formatter={(value) => [`$${value}`, 'Price']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right: Store Comparison */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Store Comparison</h3>
            <div className="space-y-3">
              {product.stores.map((store, idx) => (
                <div 
                  key={idx}
                  className={`glass rounded-xl p-4 flex items-center justify-between ${
                    store.price === product.bestPrice ? 'border-2 border-green-500/50 bg-green-500/10' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{store.name}</h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-400 mt-1">
                        <span className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{store.rating}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Truck className="w-3 h-3" />
                          <span>{store.shipping}</span>
                        </span>
                        {!store.inStock && (
                          <span className="text-red-400 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${store.price}</div>
                    {store.price === product.bestPrice && (
                      <span className="text-xs text-green-400 font-medium">Best Deal</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Savings Alert */}
            {product.savings > 0 && (
              <div className="mt-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-green-400 font-semibold">Potential Savings</p>
                  <p className="text-sm text-gray-400">Compared to highest price</p>
                </div>
                <div className="text-3xl font-bold text-green-400">
                  ${product.savings} <span className="text-lg">({product.savingsPercent}%)</span>
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button className="flex-1 glass py-3 rounded-xl font-medium hover:bg-white/10 transition-all flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-3 rounded-xl font-medium transition-all flex items-center justify-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Track Price</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}