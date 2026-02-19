'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingDown, Store, Star, ShoppingCart, Heart, Share2, Zap, Package, ArrowUpRight, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

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
      const params = new URLSearchParams({ q: searchQuery, category: selectedCategory, sort: sortBy })
      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products)
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id])
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-50 glass sticky top-0 border-b border-white/10 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black gradient-text">PriceWise</h1>
                <p className="text-xs text-gray-400">Compare & Save</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <span className="flex items-center space-x-1 hover:text-white cursor-pointer">
                <TrendingDown className="w-4 h-4" />
                <span className="hidden sm:inline">Deals</span>
              </span>
              <span className="flex items-center space-x-1 hover:text-white cursor-pointer">
                <Heart className="w-4 h-4" />
                <span>({favorites.length})</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-40 w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Find the <span className="gradient-text">Best Deals</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Compare prices across top stores instantly. Save money on every purchase.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25"></div>
            <div className="relative glass rounded-2xl p-2 flex items-center shadow-2xl">
              <Search className="w-6 h-6 text-gray-400 ml-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-lg text-white placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={fetchProducts}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-transform hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full capitalize font-medium transition-all ${
                  selectedCategory === cat 
                    ? 'bg-white text-black shadow-lg' 
                    : 'glass text-gray-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass px-6 py-2 rounded-full text-gray-300 outline-none cursor-pointer"
          >
            <option value="relevance">Sort by Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-40 w-full px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => (
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
        </div>
      </section>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}

function ProductCard({ product, isFavorite, onToggleFavorite, onViewDetails }) {
  return (
    <div className="glass rounded-2xl overflow-hidden glass-hover transition-all duration-300 group">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
        {product.savings > 0 && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            Save ${product.savings}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-bold text-blue-400 uppercase">{product.category}</span>
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="ml-1 text-sm font-bold">{product.bestStore.rating}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">{product.name}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Best Price</span>
            <span className="text-3xl font-black text-green-400">${product.bestPrice}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Was</span>
            <span className="line-through">${product.worstPrice}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.stores.slice(0, 3).map((store, idx) => (
            <span 
              key={idx}
              className={`text-xs px-2 py-1 rounded ${
                store.price === product.bestPrice 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-white/5 text-gray-400'
              }`}
            >
              {store.name}
            </span>
          ))}
        </div>

        <div className="flex space-x-3">
          <button 
            onClick={onViewDetails}
            className="flex-1 glass py-3 rounded-xl font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
          >
            <span>Compare</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <a 
            href={product.bestStore.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={onClose}>
      <div 
        className="glass rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 glass border-b border-white/10 p-6 flex justify-between items-center bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <h2 className="text-2xl font-bold gradient-text">{product.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-2xl" />
            
            <div className="glass rounded-2xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <TrendingDown className="w-5 h-5 text-blue-400 mr-2" />
                Price History
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={product.priceHistory}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px' }}
                      formatter={(v) => [`$${v}`, 'Price']}
                    />
                    <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Store Comparison</h3>
            {product.stores.map((store, idx) => (
              <div 
                key={idx}
                className={`glass rounded-xl p-4 flex items-center justify-between border ${
                  store.price === product.bestPrice ? 'border-green-500/50 bg-green-500/10' : 'border-white/10'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <h4 className="font-bold">{store.name}</h4>
                    <div className="flex items-center space-x-3 text-sm text-gray-400">
                      <span className="flex items-center"><Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />{store.rating}</span>
                      <span>{store.shipping}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${store.price}</div>
                  {store.price === product.bestPrice && <span className="text-xs text-green-400">Best Deal</span>}
                </div>
              </div>
            ))}

            {product.savings > 0 && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <p className="text-green-400 font-bold">You Save</p>
                  <p className="text-sm text-gray-400">vs highest price</p>
                </div>
                <div className="text-3xl font-black text-green-400">${product.savings} <span className="text-lg">({product.savingsPercent}%)</span></div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button className="flex-1 glass py-3 rounded-xl font-bold hover:bg-white/10 flex items-center justify-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
              <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-xl font-bold flex items-center justify-center space-x-2">
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