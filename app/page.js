'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, TrendingDown, Star, ShoppingCart, Heart, Share2, Zap, Package, ArrowUpRight, X, RefreshCw, Globe, Clock, AlertCircle, CheckCircle, ChevronDown, ExternalLink } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

// ALL STYLES IN JAVASCRIPT
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0f172a 0%, #000000 50%, #1e293b 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  liveIndicator: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(34, 197, 94, 0.2)',
    color: '#4ade80',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 700,
    border: '1px solid rgba(34, 197, 94, 0.3)',
  },
  pulseDot: {
    width: '8px',
    height: '8px',
    background: '#22c55e',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  searchContainer: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto 32px',
  },
  storeSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
    padding: '0 16px',
  },
  storeChip: (selected, color) => ({
    padding: '8px 16px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    background: selected ? color : 'rgba(255,255,255,0.05)',
    color: selected ? 'white' : '#94a3b8',
    boxShadow: selected ? `0 4px 12px ${color}40` : 'none',
  }),
  liveResults: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 80px',
  },
  resultCard: (isBest) => ({
    background: isBest ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: isBest ? '2px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gap: '24px',
    alignItems: 'center',
    transition: 'all 0.3s',
    position: 'relative',
    overflow: 'hidden',
  }),
  bestDealBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    color: 'white',
    padding: '6px 16px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
  },
  priceTag: {
    fontSize: '36px',
    fontWeight: 900,
    color: '#4ade80',
  },
  competitorPrice: {
    fontSize: '14px',
    color: '#94a3b8',
    textDecoration: 'line-through',
  },
  storeLogo: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    background: 'rgba(255,255,255,0.1)',
  },
  loadingBar: {
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  loadingProgress: {
    height: '100%',
    background: 'linear-gradient(90deg, #3b82f6, #9333ea)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    padding: '20px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 900,
    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
}

const AVAILABLE_STORES = [
  { name: 'Amazon', color: '#FF9900', logo: '📦' },
  { name: 'eBay', color: '#E53238', logo: '🏷️' },
  { name: 'Walmart', color: '#0071CE', logo: '🛒' },
  { name: 'Target', color: '#CC0000', logo: '🎯' },
  { name: 'Best Buy', color: '#003B64', logo: '💻' },
  { name: 'AliExpress', color: '#FF4747', logo: '🌏' },
  { name: 'Newegg', color: '#F7C200', logo: '🥚' },
  { name: 'Etsy', color: '#F56400', logo: '🎨' },
]

export default function LivePriceComparator() {
  const [query, setQuery] = useState('')
  const [selectedStores, setSelectedStores] = useState(['Amazon', 'eBay', 'Walmart', 'Target'])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [searchProgress, setSearchProgress] = useState(0)
  const [searchHistory, setSearchHistory] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showTrackingModal, setShowTrackingModal] = useState(false)
  const [trackingItem, setTrackingItem] = useState(null)

  const toggleStore = (storeName) => {
    setSelectedStores(prev => 
      prev.includes(storeName) 
        ? prev.filter(s => s !== storeName)
        : [...prev, storeName]
    )
  }

  const performLiveSearch = async () => {
    if (!query.trim() || selectedStores.length === 0) return
    
    setLoading(true)
    setResults(null)
    setSearchProgress(0)
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => Math.min(prev + 10, 90))
    }, 200)
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, stores: selectedStores })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setResults(data)
        setSearchHistory(prev => [{
          query,
          time: new Date().toLocaleTimeString(),
          bestPrice: data.stats.bestPrice,
          stores: data.stats.totalStoresSearched
        }, ...prev.slice(0, 4)])
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      clearInterval(progressInterval)
      setSearchProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  const startTracking = (item) => {
    setTrackingItem(item)
    setShowTrackingModal(true)
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .result-enter { animation: slideIn 0.5s ease forwards; }
      `}</style>

      {/* Header */}
      <header style={{...styles.header, padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
        <div style={{maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #9333ea)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Zap size={28} color="white" />
            </div>
            <div>
              <h1 style={{fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #3b82f6, #9333ea, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                PriceWise Live
              </h1>
              <div style={styles.liveIndicator}>
                <span style={styles.pulseDot}></span>
                LIVE SEARCH ACTIVE
              </div>
            </div>
          </div>
          
          <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
            <span style={{color: '#94a3b8', fontSize: '14px'}}>
              <Globe size={16} style={{display: 'inline', marginRight: '6px'}} />
              Searching {AVAILABLE_STORES.length} global stores
            </span>
          </div>
        </div>
      </header>

      {/* Hero Search */}
      <section style={{padding: '40px 24px', textAlign: 'center'}}>
        <h2 style={{fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: '16px'}}>
          Hunt for the <span style={{color: '#4ade80'}}>Best Price</span> Live
        </h2>
        <p style={{color: '#94a3b8', fontSize: '18px', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px'}}>
          Real-time price comparison across Amazon, eBay, Walmart, Target & more
        </p>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={{display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)'}}>
            <Search size={24} color="#64748b" style={{margin: '12px'}} />
            <input
              type="text"
              placeholder="What are you looking for? (e.g., 'iPhone 15', 'Sony headphones')"
              style={{flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '16px', padding: '12px'}}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performLiveSearch()}
            />
            <button 
              onClick={performLiveSearch}
              disabled={loading || !query.trim()}
              style={{
                background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #3b82f6, #9333ea)',
                color: 'white',
                border: 'none',
                padding: '12px 32px',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? <RefreshCw size={20} className="spin" /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Search Live'}
            </button>
          </div>
          
          {loading && (
            <div style={styles.loadingBar}>
              <div style={{...styles.loadingProgress, width: `${searchProgress}%`}}></div>
            </div>
          )}
        </div>

        {/* Store Selector */}
        <div style={styles.storeSelector}>
          {AVAILABLE_STORES.map(store => (
            <button
              key={store.name}
              onClick={() => toggleStore(store.name)}
              style={styles.storeChip(selectedStores.includes(store.name), store.color)}
            >
              <span>{store.logo}</span>
              {store.name}
              {selectedStores.includes(store.name) && <CheckCircle size={14} />}
            </button>
          ))}
        </div>
      </section>

      {/* Live Results */}
      {results && (
        <section style={styles.liveResults}>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>${results.stats.bestPrice}</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Best Price Found</div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text'}}>
                ${results.stats.potentialSavings}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Max Savings</div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text'}}>
                {results.results.length}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Stores Compared</div>
            </div>
            <div style={styles.statCard}>
              <div style={{fontSize: '24px', fontWeight: 700, color: 'white'}}>{results.stats.searchTimeMs}ms</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Search Time</div>
            </div>
          </div>

          {/* Results List */}
          <h3 style={{fontSize: '24px', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <TrendingDown size={28} color="#4ade80" />
            Live Price Comparison Results
          </h3>

          {results.results.map((item, index) => (
            <div 
              key={item.id} 
              style={styles.resultCard(item.isBestDeal)}
              className="result-enter"
            >
              {item.isBestDeal && (
                <div style={styles.bestDealBadge}>🏆 BEST DEAL</div>
              )}
              
              <div style={styles.storeLogo}>
                {item.storeLogo}
              </div>
              
              <div style={{minWidth: 0}}>
                <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: item.isBestDeal ? '#4ade80' : 'white'}}>
                  {item.title}
                </h4>
                <div style={{display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}>
                    <Star size={16} fill="#fbbf24" /> {item.rating} ({item.reviews.toLocaleString()})
                  </span>
                  <span style={{color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px'}}>
                    <Clock size={14} /> {item.shipping}
                  </span>
                  {!item.inStock && (
                    <span style={{color: '#ef4444', fontSize: '12px', fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: '6px'}}>
                      OUT OF STOCK
                    </span>
                  )}
                  {item.deals.map((deal, i) => (
                    <span key={i} style={{color: '#22c55e', fontSize: '12px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', padding: '4px 8px', borderRadius: '6px'}}>
                      {deal}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{textAlign: 'right'}}>
                <div style={styles.priceTag}>${item.price}</div>
                <div style={styles.competitorPrice}>${item.originalPrice}</div>
                <div style={{color: '#4ade80', fontSize: '14px', fontWeight: 600}}>
                  Save ${item.savingsVsHighest} ({item.savingsPercent}%)
                </div>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #9333ea)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <ShoppingCart size={18} />
                  Buy Now
                  <ExternalLink size={14} />
                </a>
                <button 
                  onClick={() => startTracking(item)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Package size={16} />
                  Track Price
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Recent Searches */}
      {searchHistory.length > 0 && !results && (
        <section style={{maxWidth: '800px', margin: '0 auto', padding: '0 24px 40px'}}>
          <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#94a3b8'}}>
            <Clock size={18} style={{display: 'inline', marginRight: '8px'}} />
            Recent Live Searches
          </h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {searchHistory.map((search, i) => (
              <button
                key={i}
                onClick={() => { setQuery(search.query); performLiveSearch(); }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <span style={{fontWeight: 600}}>{search.query}</span>
                <span style={{color: '#94a3b8', fontSize: '14px'}}>
                  Best: ${search.bestPrice} • {search.stores} stores • {search.time}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && trackingItem && (
        <PriceTrackingModal 
          item={trackingItem} 
          onClose={() => setShowTrackingModal(false)} 
        />
      )}
    </div>
  )
}

function PriceTrackingModal({ item, onClose }) {
  const [targetPrice, setTargetPrice] = useState(Math.floor(item.price * 0.9))
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submitTracking = async () => {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: item.id,
        productName: item.title,
        currentPrice: item.price,
        store: item.store,
        targetPrice,
        email
      })
    })
    setSubmitted(true)
  }

  return (
    <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'}} onClick={onClose}>
      <div style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%'}} onClick={e => e.stopPropagation()}>
        {!submitted ? (
          <>
            <h3 style={{fontSize: '24px', fontWeight: 700, marginBottom: '8px'}}>🔔 Price Alert</h3>
            <p style={{color: '#94a3b8', marginBottom: '24px'}}>Get notified when {item.title} drops below your target price</p>
            
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', color: '#94a3b8', fontSize: '14px', marginBottom: '8px'}}>Current Price: ${item.price}</label>
              <input 
                type="range" 
                min="1" 
                max={item.price} 
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                style={{width: '100%', marginBottom: '8px'}}
              />
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{color: '#4ade80', fontSize: '24px', fontWeight: 900}}>${targetPrice}</span>
                <span style={{color: '#94a3b8', fontSize: '14px'}}>Target Price</span>
              </div>
            </div>

            <input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '16px', color: 'white', marginBottom: '24px', outline: 'none'}}
            />

            <button 
              onClick={submitTracking}
              style={{width: '100%', background: 'linear-gradient(135deg, #3b82f6, #9333ea)', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer'}}
            >
              Start Tracking
            </button>
          </>
        ) : (
          <div style={{textAlign: 'center', padding: '24px'}}>
            <div style={{width: '64px', height: '64px', background: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px'}}>
              <CheckCircle size={32} color="#4ade80" />
            </div>
            <h3 style={{fontSize: '24px', fontWeight: 700, marginBottom: '8px'}}>Tracking Activated!</h3>
            <p style={{color: '#94a3b8'}}>We'll email you at {email} when the price drops to ${targetPrice} or below.</p>
            <button onClick={onClose} style={{marginTop: '24px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', cursor: 'pointer'}}>Close</button>
          </div>
        )}
      </div>
    </div>
  )
}