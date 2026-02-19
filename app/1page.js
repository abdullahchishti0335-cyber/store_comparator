'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingDown, Store, Star, ShoppingCart, Heart, Share2, Zap, Package, ArrowUpRight, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// ALL STYLES IN JAVASCRIPT - NO CSS FILE NEEDED!
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0f172a 0%, #000000 50%, #1e293b 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  backgroundEffects: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    zIndex: 0,
  },
  blurCircle: (color, delay = 0) => ({
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.15,
    animation: `float 6s ease-in-out infinite ${delay}s`,
    background: color,
  }),
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    width: '100%',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 30px rgba(59,130,246,0.3)',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  hero: {
    position: 'relative',
    zIndex: 40,
    padding: '64px 24px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 'clamp(40px, 8vw, 72px)',
    fontWeight: 900,
    marginBottom: '24px',
    lineHeight: 1.1,
  },
  gradientText: {
    background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: '#94a3b8',
    marginBottom: '40px',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '640px',
    margin: '0 auto 32px',
  },
  searchGlow: {
    position: 'absolute',
    inset: '-4px',
    background: 'linear-gradient(135deg, #2563eb, #9333ea)',
    borderRadius: '16px',
    opacity: 0.25,
    filter: 'blur(8px)',
  },
  searchBar: {
    position: 'relative',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'white',
    fontSize: '18px',
    padding: '12px 16px',
  },
  searchButton: {
    background: 'linear-gradient(135deg, #2563eb, #9333ea)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  categoryButton: (active) => ({
    padding: '10px 24px',
    borderRadius: '9999px',
    fontWeight: 600,
    cursor: 'pointer',
    border: 'none',
    background: active ? 'white' : 'rgba(255,255,255,0.05)',
    color: active ? 'black' : '#94a3b8',
    backdropFilter: active ? 'none' : 'blur(10px)',
    border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s',
  }),
  select: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#94a3b8',
    padding: '10px 24px',
    borderRadius: '9999px',
    outline: 'none',
    cursor: 'pointer',
  },
  grid: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px 80px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.3s',
    cursor: 'pointer',
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cardImage: {
    width: '100%',
    height: '224px',
    objectFit: 'cover',
  },
  cardContent: {
    padding: '24px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  categoryTag: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#60a5fa',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#fbbf24',
  },
  productName: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '16px',
    lineHeight: 1.3,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  priceLabel: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  bestPrice: {
    fontSize: '32px',
    fontWeight: 900,
    color: '#4ade80',
  },
  oldPrice: {
    color: '#64748b',
    textDecoration: 'line-through',
  },
  storeTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px',
  },
  storeTag: (isBest) => ({
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    background: isBest ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
    color: isBest ? '#4ade80' : '#94a3b8',
    border: isBest ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(255,255,255,0.1)',
  }),
  cardButtons: {
    display: 'flex',
    gap: '12px',
  },
  buttonSecondary: {
    flex: 1,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonPrimary: {
    flex: 1,
    background: 'linear-gradient(135deg, #2563eb, #9333ea)',
    border: 'none',
    color: 'white',
    padding: '12px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.9)',
    backdropFilter: 'blur(10px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalContent: {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    maxWidth: '1000px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(90deg, rgba(37,99,235,0.2), rgba(147,51,234,0.2))',
  },
  savingsBadge: {
    position: 'absolute',
    top: '16px',
    left: '16px',
    background: '#22c55e',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: 700,
  },
  favoriteButton: (isFav) => ({
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: isFav ? '#ef4444' : 'rgba(0,0,0,0.5)',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  }),
}

export default function PriceComparator() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [favorites, setFavorites] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)

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
    <div style={styles.container}>
      {/* Inject keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      {/* Background */}
      <div style={styles.backgroundEffects}>
        <div style={{...styles.blurCircle('#2563eb', 0), top: '-100px', left: '-100px'}} />
        <div style={{...styles.blurCircle('#9333ea', 2), top: '0', right: '-50px'}} />
        <div style={{...styles.blurCircle('#ec4899', 4), bottom: '-100px', left: '100px'}} />
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <Zap size={28} color="white" />
            </div>
            <span style={styles.logoText}>PriceWise</span>
          </div>
          <div style={{display: 'flex', gap: '24px', color: '#94a3b8'}}>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}>
              <TrendingDown size={18} /> Deals
            </span>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'}}>
              <Heart size={18} /> ({favorites.length})
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Find the <span style={styles.gradientText}>Best Deals</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Compare prices across top stores instantly. Save money on every purchase.
        </p>

        <div style={styles.searchContainer}>
          <div style={styles.searchGlow} />
          <div style={styles.searchBar}>
            <Search size={24} color="#64748b" style={{marginLeft: '12px'}} />
            <input
              type="text"
              placeholder="Search products..."
              style={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              onClick={fetchProducts}
              style={styles.searchButton}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Search
            </button>
          </div>
        </div>

        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={styles.categoryButton(selectedCategory === cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.select}
        >
          <option value="relevance" style={{background: '#0f172a'}}>Sort by Relevance</option>
          <option value="price-low" style={{background: '#0f172a'}}>Price: Low to High</option>
          <option value="price-high" style={{background: '#0f172a'}}>Price: High to Low</option>
          <option value="rating" style={{background: '#0f172a'}}>Highest Rated</option>
        </select>
      </section>

      {/* Products */}
      <section style={styles.grid}>
        {loading ? (
          [1,2,3,4,5,6].map(i => (
            <div key={i} style={{...styles.card, height: '400px', animation: 'pulse 2s infinite'}} />
          ))
        ) : (
          products.map(product => (
            <div 
              key={product.id}
              style={{...styles.card, ...(hoveredCard === product.id ? styles.cardHover : {})}}
              onMouseEnter={() => setHoveredCard(product.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{position: 'relative'}}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={styles.cardImage}
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                  style={styles.favoriteButton(favorites.includes(product.id))}
                >
                  <Heart size={20} fill={favorites.includes(product.id) ? "white" : "none"} />
                </button>
                {product.savings > 0 && (
                  <div style={styles.savingsBadge}>Save ${product.savings}</div>
                )}
              </div>

              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <span style={styles.categoryTag}>{product.category}</span>
                  <div style={styles.rating}>
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span style={{fontSize: '14px', fontWeight: 600}}>{product.bestStore.rating}</span>
                  </div>
                </div>

                <h3 style={styles.productName}>{product.name}</h3>

                <div style={styles.priceRow}>
                  <span style={styles.priceLabel}>Best Price</span>
                  <span style={styles.bestPrice}>${product.bestPrice}</span>
                </div>
                <div style={{...styles.priceRow, marginBottom: '16px'}}>
                  <span style={styles.priceLabel}>Was</span>
                  <span style={styles.oldPrice}>${product.worstPrice}</span>
                </div>

                <div style={styles.storeTags}>
                  {product.stores.slice(0, 3).map((store, idx) => (
                    <span key={idx} style={styles.storeTag(store.price === product.bestPrice)}>
                      {store.name}
                    </span>
                  ))}
                </div>

                <div style={styles.cardButtons}>
                  <button 
                    onClick={() => setSelectedProduct(product)}
                    style={styles.buttonSecondary}
                  >
                    Compare <ArrowUpRight size={18} />
                  </button>
                  <a 
                    href={product.bestStore.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{...styles.buttonPrimary, textDecoration: 'none'}}
                  >
                    <ShoppingCart size={18} /> Buy Now
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          styles={styles}
        />
      )}
    </div>
  )
}

function ProductModal({ product, onClose, styles }) {
  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={{...styles.gradientText, fontSize: '24px', fontWeight: 700}}>{product.name}</h2>
          <button 
            onClick={onClose}
            style={{background: 'none', border: 'none', color: 'white', cursor: 'pointer'}}
          >
            <X size={28} />
          </button>
        </div>

        <div style={{padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
          <div>
            <img 
              src={product.image} 
              alt={product.name} 
              style={{width: '100%', height: '250px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px'}} 
            />
            
            <div style={{background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)'}}>
              <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <TrendingDown size={20} color="#60a5fa" /> Price History
              </h3>
              <div style={{height: '200px'}}>
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

          <div>
            <h3 style={{fontSize: '20px', fontWeight: 700, marginBottom: '16px'}}>Store Comparison</h3>
            {product.stores.map((store, idx) => (
              <div 
                key={idx}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: store.price === product.bestPrice ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: store.price === product.bestPrice ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.05)',
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <div style={{width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Store size={24} color="#94a3b8" />
                    </div>
                    <div>
                      <h4 style={{fontWeight: 700}}>{store.name}</h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '14px'}}>
                        <Star size={14} fill="#fbbf24" color="#fbbf24" /> {store.rating} • {store.shipping}
                      </div>
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '24px', fontWeight: 900}}>${store.price}</div>
                    {store.price === product.bestPrice && (
                      <span style={{color: '#4ade80', fontSize: '12px', fontWeight: 700}}>BEST DEAL</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {product.savings > 0 && (
              <div style={{
                background: 'linear-gradient(90deg, rgba(74,222,128,0.2), rgba(16,185,129,0.2))',
                border: '1px solid rgba(74,222,128,0.3)',
                borderRadius: '12px',
                padding: '20px',
                marginTop: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <p style={{color: '#4ade80', fontWeight: 700, fontSize: '18px'}}>You Save</p>
                  <p style={{color: '#94a3b8', fontSize: '14px'}}>vs highest price</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: '36px', fontWeight: 900, color: '#4ade80'}}>${product.savings}</div>
                  <div style={{color: '#4ade80', fontWeight: 700}}>({product.savingsPercent}% off)</div>
                </div>
              </div>
            )}

            <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
              <button style={{...styles.buttonSecondary, flex: 1}}>
                <Share2 size={20} /> Share
              </button>
              <button style={{...styles.buttonPrimary, flex: 1}}>
                <Package size={20} /> Track Price
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}