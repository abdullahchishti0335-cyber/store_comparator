'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingDown, Star, ShoppingCart, RefreshCw, AlertCircle } from 'lucide-react'

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0f172a 0%, #000000 50%, #1e293b 100%)',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
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
    maxWidth: '800px',
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
    padding: '12px 32px',
    borderRadius: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  storeSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '24px',
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
    background: selected ? color : 'rgba(255,255,255,0.05)',
    color: selected ? 'white' : '#94a3b8',
    boxShadow: selected ? `0 4px 12px ${color}40` : 'none',
  }),
  grid: {
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
    position: 'relative',
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
  },
  priceTag: {
    fontSize: '36px',
    fontWeight: 900,
    color: '#4ade80',
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
  storesFound: {
    marginBottom: '24px', 
    display: 'flex', 
    gap: '12px', 
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  storeTag: {
    background: 'rgba(255,255,255,0.1)',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
  },
  alertBox: {
    background: 'rgba(234, 179, 8, 0.1)',
    border: '1px solid rgba(234, 179, 8, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#eab308',
  },
}

// Available stores configuration - will be dynamically updated based on results
const DEFAULT_STORES = [
  { name: 'Amazon', color: '#FF9900', logo: '📦' },
  { name: 'Walmart', color: '#0071CE', logo: '🛒' },
  { name: 'Target', color: '#CC0000', logo: '🎯' },
  { name: 'eBay', color: '#E53238', logo: '🏷️' },
  { name: 'Best Buy', color: '#0046BE', logo: '💻' },
]

export default function LivePriceComparator() {
  const [query, setQuery] = useState('')
  const [selectedStores, setSelectedStores] = useState(['Amazon', 'Walmart', 'Target', 'eBay'])
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [searchProgress, setSearchProgress] = useState(0)
  const [availableStores, setAvailableStores] = useState(DEFAULT_STORES)

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
    setSearchResults(null)
    setSearchProgress(0)

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
        setSearchResults(data)

        // Update available stores based on results
        if (data.meta?.storesFound) {
          const foundStores = data.meta.storesFound
          const updatedStores = DEFAULT_STORES.filter(s => foundStores.includes(s.name))

          // Add any stores not in default list
          foundStores.forEach(storeName => {
            if (!updatedStores.find(s => s.name === storeName)) {
              updatedStores.push({
                name: storeName,
                color: '#666666',
                logo: '🏪'
              })
            }
          })

          setAvailableStores(updatedStores)
        }
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      clearInterval(progressInterval)
      setSearchProgress(100)
      setTimeout(() => setLoading(false), 500)
    }
  }

  // Get store config for a result item
  const getStoreConfig = (storeName) => {
    return availableStores.find(s => s.name === storeName) || 
           DEFAULT_STORES.find(s => s.name === storeName) ||
           { name: storeName, color: '#666666', logo: '🏪' }
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <TrendingDown size={28} color="white" />
            </div>
            <div>
              <h1 style={styles.logoText}>PriceWise Live</h1>
              <div style={styles.liveIndicator}>
                <span style={styles.pulseDot}></span>
                LIVE SEARCH
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>
          Find the <span style={styles.gradientText}>Best Price</span> Live
        </h2>
        <p style={styles.heroSubtitle}>
          Real-time price comparison across Amazon, Walmart, Target & more via Google Shopping
        </p>

        <div style={styles.searchContainer}>
          <div style={styles.searchGlow} />
          <div style={styles.searchBar}>
            <Search size={24} color="#64748b" style={{marginLeft: '12px'}} />
            <input
              type="text"
              placeholder="Search products..."
              style={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performLiveSearch()}
            />
            <button 
              onClick={performLiveSearch}
              disabled={loading}
              style={{...styles.searchButton, opacity: loading ? 0.6 : 1}}
            >
              {loading ? <RefreshCw size={20} className="spin" /> : <Search size={20} />}
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {loading && (
            <div style={styles.loadingBar}>
              <div style={{...styles.loadingProgress, width: `${searchProgress}%`}} />
            </div>
          )}
        </div>

        <div style={styles.storeSelector}>
          {DEFAULT_STORES.map(store => (
            <button
              key={store.name}
              onClick={() => toggleStore(store.name)}
              style={styles.storeChip(selectedStores.includes(store.name), store.color)}
            >
              <span>{store.logo}</span>
              {store.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      {searchResults && (
        <section style={styles.grid}>
          {/* Alert if some stores not found */}
          {searchResults.meta?.sourcesUsed && searchResults.meta.sourcesUsed.length < selectedStores.length && (
            <div style={styles.alertBox}>
              <AlertCircle size={20} />
              <span>
                Showing results from {searchResults.meta.sourcesUsed.join(', ')}. 
                Other selected stores may not have this product.
              </span>
            </div>
          )}

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statValue}>${searchResults.results[0]?.price}</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Best Price</div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text'}}>
                ${Math.max(...searchResults.results.map(r => r.price)) - Math.min(...searchResults.results.map(r => r.price))}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Max Savings</div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #10b981, #059669)', WebkitBackgroundClip: 'text'}}>
                {searchResults.results.length}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Results Found</div>
            </div>
          </div>

          {/* Stores Found */}
          {searchResults?.meta?.storesFound && (
            <div style={styles.storesFound}>
              <span style={{color: '#94a3b8'}}>Stores with results:</span>
              {searchResults.meta.storesFound.map(store => {
                const config = getStoreConfig(store)
                return (
                  <span key={store} style={{...styles.storeTag, borderLeft: `3px solid ${config.color}`}}>
                    {config.logo} {store}
                  </span>
                )
              })}
            </div>
          )}

          {/* Results List */}
          {searchResults.results.map((item, index) => {
            const storeConfig = getStoreConfig(item.store)
            return (
              <div key={item.id || index} style={styles.resultCard(item.isBestDeal)}>
                {item.isBestDeal && <div style={styles.bestDealBadge}>BEST DEAL</div>}

                <div style={{...styles.storeLogo, background: `${storeConfig.color}20`}}>
                  {storeConfig.logo}
                </div>

                <div>
                  <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>
                    {item.title}
                  </h4>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8'}}>
                    <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}>
                      <Star size={16} fill="#fbbf24" /> {item.rating}
                    </span>
                    <span>{item.shipping}</span>
                    <span style={{color: storeConfig.color, fontSize: '12px', fontWeight: 700}}>
                      {item.source}
                    </span>
                  </div>
                </div>

                <div style={{textAlign: 'right'}}>
                  <div style={styles.priceTag}>${item.price}</div>
                  {item.originalPrice && (
                    <div style={{color: '#64748b', textDecoration: 'line-through'}}>
                      ${item.originalPrice}
                    </div>
                  )}
                </div>

                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: `linear-gradient(135deg, ${storeConfig.color}, #9333ea)`,
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ShoppingCart size={18} />
                  Buy
                </a>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}