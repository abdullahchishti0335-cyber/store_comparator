'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, TrendingDown, Star, ShoppingCart, RefreshCw, Github, Heart, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

// Store configurations with logo paths
const AVAILABLE_STORES = [
  { name: 'Amazon', color: '#FF9900', logo: '/amazon-logo.png' },
  { name: 'Walmart', color: '#0071CE', logo: '/walmart-logo.jpg' },
  { name: 'eBay', color: '#E53238', logo: '/ebay-logo.png' },
  { name: 'Best Buy', color: '#0046BE', logo: '/bestbuy-logo.png' },
]

export default function LivePriceComparator() {
  const [query, setQuery] = useState('')
  const [selectedStores, setSelectedStores] = useState(['Amazon', 'Walmart', 'eBay', 'Best Buy'])
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [searchProgress, setSearchProgress] = useState(0)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [hoveredStore, setHoveredStore] = useState(null)
  const [hoveredStat, setHoveredStat] = useState(null)
  const [hoveredFooterLink, setHoveredFooterLink] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRefs = useRef({})
  const containerRef = useRef(null)

  // Track mouse position for global glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Scroll progress tracker with background color shift
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((scrollTop / docHeight) * 100, 100)
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Calculate background gradient based on scroll
  const getBackgroundStyle = () => {
    // Shift from dark blue-purple to deeper purple-pink as you scroll
    const hue1 = 220 - (scrollProgress * 0.3) // 220 -> 190
    const hue2 = 270 + (scrollProgress * 0.2) // 270 -> 290
    const hue3 = 220 + (scrollProgress * 0.4) // 220 -> 260
    
    return {
      background: `linear-gradient(135deg, 
        hsl(${hue1}, 60%, 8%) 0%, 
        hsl(${hue2}, 50%, 5%) 50%, 
        hsl(${hue3}, 55%, 10%) 100%)`,
      transition: 'background 0.3s ease-out',
    }
  }

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
      setSearchProgress(prev => Math.min(prev + 15, 90))
    }, 200)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, stores: selectedStores })
      })

      const data = await response.json()

      if (data.success) {
        const processedResults = processResults(data)
        setSearchResults({ ...data, results: processedResults })
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

  // Process results: separate by API source and sort by price
  const processResults = (data) => {
    if (!data.results) return []
    
    const amazonResults = data.results.filter(r => 
      r.source?.toLowerCase().includes('rapidapi') || 
      r.store === 'Amazon'
    ).map(r => ({ ...r, apiSource: 'rapidapi' }))
    
    const serperResults = data.results.filter(r => 
      !r.source?.toLowerCase().includes('rapidapi') && 
      r.store !== 'Amazon'
    ).map(r => ({ ...r, apiSource: 'serper' }))
    
    const sortByPrice = (a, b) => a.price - b.price
    amazonResults.sort(sortByPrice)
    serperResults.sort(sortByPrice)
    
    const allResults = [...amazonResults, ...serperResults]
    if (allResults.length > 0) {
      const minPrice = Math.min(...allResults.map(r => r.price))
      allResults.forEach(r => {
        r.isBestDeal = r.price === minPrice
      })
    }
    
    return allResults
  }

  const getStoreConfig = (storeName) => {
    return AVAILABLE_STORES.find(s => s.name === storeName) ||
           { name: storeName, color: '#666666', logo: null }
  }

  const getAmazonResults = () => {
    if (!searchResults?.results) return []
    return searchResults.results.filter(r => r.apiSource === 'rapidapi' || r.store === 'Amazon')
  }

  const getSerperResults = () => {
    if (!searchResults?.results) return []
    return searchResults.results.filter(r => r.apiSource === 'serper' && r.store !== 'Amazon')
  }

  // Store Logo Component using actual images
  const StoreLogo = ({ storeName, size = 'normal' }) => {
    const config = getStoreConfig(storeName)
    const dimensions = size === 'small' ? { width: 40, height: 40 } : { width: 56, height: 56 }
    
    if (!config.logo) {
      return (
        <div style={{
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold',
          color: config.color,
        }}>
          {storeName[0]}
        </div>
      )
    }

    return (
      <div style={{
        width: dimensions.width,
        height: dimensions.height,
        borderRadius: '12px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        overflow: 'hidden',
        border: `2px solid ${config.color}40`,
      }}>
        <Image 
          src={config.logo} 
          alt={storeName}
          width={dimensions.width - 8}
          height={dimensions.height - 8}
          style={{ objectFit: 'contain' }}
        />
      </div>
    )
  }

  // Store Chip Logo (smaller for filter buttons)
  const StoreChipLogo = ({ storeName }) => {
    const config = getStoreConfig(storeName)
    
    if (!config.logo) {
      return (
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: config.color }}>
          {storeName[0]}
        </span>
      )
    }

    return (
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px',
        overflow: 'hidden',
      }}>
        <Image 
          src={config.logo} 
          alt={storeName}
          width={24}
          height={24}
          style={{ objectFit: 'contain' }}
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} style={{...styles.container, ...getBackgroundStyle()}}>
      {/* Global Styles */}
      <style>{`
        @keyframes pulse { 
          0%, 100% { opacity: 1; transform: scale(1); } 
          50% { opacity: 0.7; transform: scale(1.1); } 
        }
        @keyframes glowPulse { 
          0%, 100% { opacity: 0.25; } 
          50% { opacity: 0.4; } 
        }
        @keyframes shimmer { 
          0% { background-position: -200% 0; } 
          100% { background-position: 200% 0; } 
        }
        @keyframes float { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        @keyframes badgePulse { 
          0%, 100% { box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4); } 
          50% { box-shadow: 0 4px 25px rgba(34, 197, 94, 0.7); } 
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-enter {
          animation: slideIn 0.5s ease-out forwards;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      {/* Apple-style Mouse Glow Effect */}
      <div 
        style={{
          position: 'fixed',
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.08) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'left 0.1s ease-out, top 0.1s ease-out',
          filter: 'blur(40px)',
        }}
      />

      {/* Secondary glow for depth */}
      <div 
        style={{
          position: 'fixed',
          left: mousePosition.x - 80,
          top: mousePosition.y - 80,
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 60%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'left 0.08s ease-out, top 0.08s ease-out',
          filter: 'blur(20px)',
        }}
      />

      {/* Scroll Progress Bar */}
      <div style={{...styles.scrollIndicator, width: `${scrollProgress}%`}} />

      {/* Animated Background Grid */}
      <div style={styles.bgGrid}>
        {Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            style={{
              ...styles.gridDot,
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              animationDelay: `${i * 0.15}s`,
              opacity: 0.1 + (scrollProgress / 500),
            }} 
          />
        ))}
      </div>

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
          Real-time price comparison across Amazon, Walmart, eBay & Best Buy
        </p>

        <div style={styles.searchContainer}>
          <div style={styles.searchGlow} />
          <div style={{
            ...styles.searchBar,
            ...(isSearchFocused ? styles.searchBarFocused : {})
          }}>
            <Search size={24} color="#64748b" style={{marginLeft: '12px'}} />
            <input
              type="text"
              placeholder="Search products..."
              style={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performLiveSearch()}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button 
              onClick={performLiveSearch}
              disabled={loading}
              style={{
                ...styles.searchButton, 
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }}
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
          {AVAILABLE_STORES.map(store => (
            <button
              key={store.name}
              onClick={() => toggleStore(store.name)}
              style={{
                ...styles.storeChip(selectedStores.includes(store.name), store.color),
                ...(hoveredStore === store.name ? styles.storeChipHover : {})
              }}
              onMouseEnter={() => setHoveredStore(store.name)}
              onMouseLeave={() => setHoveredStore(null)}
            >
              <StoreChipLogo storeName={store.name} />
              {store.name}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      {searchResults && (
        <section style={styles.grid}>
          {/* Stats */}
          <div style={styles.statsGrid}>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredStat === 'best' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat('best')}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={styles.statValue}>${searchResults.results[0]?.price}</div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Best Price</div>
            </div>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredStat === 'savings' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat('savings')}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div style={{...styles.statValue, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text'}}>
                ${Math.max(...searchResults.results.map(r => r.price)) - Math.min(...searchResults.results.map(r => r.price))}
              </div>
              <div style={{color: '#94a3b8', fontSize: '14px'}}>Max Savings</div>
            </div>
            <div 
              style={{
                ...styles.statCard,
                ...(hoveredStat === 'results' ? styles.statCardHover : {})
              }}
              onMouseEnter={() => setHoveredStat('results')}
              onMouseLeave={() => setHoveredStat(null)}
            >
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
                  <span 
                    key={store} 
                    style={{
                      ...styles.storeTag, 
                      borderLeft: `3px solid ${config.color}`,
                      ...(hoveredStore === `tag-${store}` ? styles.storeTagHover : {})
                    }}
                    onMouseEnter={() => setHoveredStore(`tag-${store}`)}
                    onMouseLeave={() => setHoveredStore(null)}
                  >
                    <StoreChipLogo storeName={store} /> {store}
                  </span>
                )
              })}
            </div>
          )}

          {/* Amazon (RapidAPI) Results Section */}
          {getAmazonResults().length > 0 && (
            <>
              <div style={styles.sectionHeader}>
                <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #FF990040, #FF990020)'}}>
                  <Zap size={20} color="#FF9900" />
                </div>
                <span style={styles.sectionTitle}>Amazon (RapidAPI)</span>
                <span style={{...styles.sectionBadge, background: 'rgba(255, 153, 0, 0.2)', color: '#FF9900'}}>
                  {getAmazonResults().length} results
                </span>
              </div>
              
              {getAmazonResults().map((item, index) => {
                const storeConfig = getStoreConfig(item.store)
                const cardId = `amazon-${index}`
                return (
                  <div 
                    key={cardId}
                    ref={el => cardRefs.current[cardId] = el}
                    style={{
                      ...styles.resultCard(item.isBestDeal),
                      ...(hoveredCard === cardId ? styles.resultCardHover : {}),
                      animationDelay: `${index * 0.1}s`,
                    }}
                    className="card-enter"
                    onMouseEnter={() => setHoveredCard(cardId)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {item.isBestDeal && (
                      <div style={styles.bestDealBadge}>
                        <Sparkles size={12} />
                        BEST DEAL
                      </div>
                    )}

                    <StoreLogo storeName={item.store} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>
                        {item.title}
                      </h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8'}}>
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}>
                          <Star size={16} fill="#fbbf24" /> {item.rating}
                        </span>
                        <span>{item.shipping}</span>
                        <span style={{color: storeConfig.color, fontSize: '12px', fontWeight: 700, padding: '2px 8px', background: `${storeConfig.color}20`, borderRadius: '4px'}}>
                          {item.source}
                        </span>
                      </div>
                    </div>

                    <div style={{textAlign: 'right', position: 'relative', zIndex: 1}}>
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
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = `0 10px 30px ${storeConfig.color}60`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <ShoppingCart size={18} />
                      Buy
                    </a>
                  </div>
                )
              })}
            </>
          )}

          {/* SerperAPI Results Section */}
          {getSerperResults().length > 0 && (
            <>
              <div style={{...styles.sectionHeader, marginTop: '48px'}}>
                <div style={{...styles.sectionIcon, background: 'linear-gradient(135deg, #3b82f640, #9333ea20)'}}>
                  <Search size={20} color="#3b82f6" />
                </div>
                <span style={styles.sectionTitle}>Other Stores (SerperAPI)</span>
                <span style={{...styles.sectionBadge, background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'}}>
                  {getSerperResults().length} results
                </span>
              </div>
              
              {getSerperResults().map((item, index) => {
                const storeConfig = getStoreConfig(item.store)
                const cardId = `serper-${index}`
                return (
                  <div 
                    key={cardId}
                    ref={el => cardRefs.current[cardId] = el}
                    style={{
                      ...styles.resultCard(item.isBestDeal),
                      ...(hoveredCard === cardId ? styles.resultCardHover : {}),
                      animationDelay: `${(getAmazonResults().length + index) * 0.1}s`,
                    }}
                    className="card-enter"
                    onMouseEnter={() => setHoveredCard(cardId)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {item.isBestDeal && (
                      <div style={styles.bestDealBadge}>
                        <Sparkles size={12} />
                        BEST DEAL
                      </div>
                    )}

                    <StoreLogo storeName={item.store} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <h4 style={{fontSize: '18px', fontWeight: 700, marginBottom: '8px'}}>
                        {item.title}
                      </h4>
                      <div style={{display: 'flex', alignItems: 'center', gap: '16px', color: '#94a3b8'}}>
                        <span style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24'}}>
                          <Star size={16} fill="#fbbf24" /> {item.rating}
                        </span>
                        <span>{item.shipping}</span>
                        <span style={{color: storeConfig.color, fontSize: '12px', fontWeight: 700, padding: '2px 8px', background: `${storeConfig.color}20`, borderRadius: '4px'}}>
                          {item.source}
                        </span>
                      </div>
                    </div>

                    <div style={{textAlign: 'right', position: 'relative', zIndex: 1}}>
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
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        zIndex: 1,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = `0 10px 30px ${storeConfig.color}60`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <ShoppingCart size={18} />
                      Buy
                    </a>
                  </div>
                )
              })}
            </>
          )}
        </section>
      )}

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLinks}>
            <a 
              href="https://github.com/abdullahchishti0335-cyber" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                ...styles.footerLink,
                ...(hoveredFooterLink === 'github' ? styles.footerLinkHover : {})
              }}
              onMouseEnter={() => setHoveredFooterLink('github')}
              onMouseLeave={() => setHoveredFooterLink(null)}
            >
              <Github size={18} />
              Muhammad Abdullah Rajpoot
            </a>
            <span style={{color: '#475569'}}>•</span>
            <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
              Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> for price hunters
            </span>
          </div>

          <div style={styles.credits}>
            <p>Powered by RapidAPI (Amazon Data) & Serper.dev (Google Shopping) • Deployed on Vercel</p>
            <p style={{marginTop: '8px'}}>© 2024 PriceWise Live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    color: 'white',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  },
  // Animated background grid
  bgGrid: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  gridDot: {
    position: 'absolute',
    width: '2px',
    height: '2px',
    background: 'rgba(147, 51, 234, 0.4)',
    borderRadius: '50%',
    animation: 'float 4s ease-in-out infinite',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(20px)',
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
    animation: 'glowPulse 3s ease-in-out infinite',
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
    transition: 'all 0.3s ease',
  },
  searchBarFocused: {
    border: '1px solid rgba(59, 130, 246, 0.5)',
    boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)',
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
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  storeSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  storeChip: (selected, color) => ({
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: selected ? `linear-gradient(135deg, ${color}40, ${color}20)` : 'rgba(255,255,255,0.05)',
    color: selected ? 'white' : '#94a3b8',
    boxShadow: selected ? `0 4px 20px ${color}40, inset 0 1px 0 ${color}60` : 'none',
    border: selected ? `1px solid ${color}80` : '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
  }),
  storeChipHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
  },
  grid: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 80px',
    position: 'relative',
    zIndex: 40,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    marginTop: '32px',
    padding: '16px 20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  sectionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 700,
  },
  sectionBadge: {
    marginLeft: 'auto',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
  },
  resultCard: (isBest) => ({
    background: isBest 
      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))' 
      : 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(20px)',
    border: isBest 
      ? '1px solid rgba(34, 197, 94, 0.4)' 
      : '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gap: '24px',
    alignItems: 'center',
    position: 'relative',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
  }),
  resultCardHover: {
    transform: 'translateY(-4px) scale(1.01)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(59, 130, 246, 0.4)',
  },
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
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
    animation: 'badgePulse 2s ease-in-out infinite',
  },
  priceTag: {
    fontSize: '36px',
    fontWeight: 900,
    color: '#4ade80',
    textShadow: '0 0 30px rgba(74, 222, 128, 0.3)',
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
    background: 'linear-gradient(90deg, #3b82f6, #9333ea, #ec4899)',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s linear infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
  statValue: {
    fontSize: '36px',
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
    background: 'rgba(255,255,255,0.05)',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'all 0.3s ease',
  },
  storeTagHover: {
    background: 'rgba(255,255,255,0.1)',
    transform: 'translateY(-2px)',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '40px 24px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '14px',
    position: 'relative',
    zIndex: 40,
  },
  footerContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#94a3b8',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.3s ease',
    padding: '8px 16px',
    borderRadius: '8px',
  },
  footerLinkHover: {
    color: 'white',
    background: 'rgba(255,255,255,0.05)',
  },
  credits: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    fontSize: '12px',
    color: '#475569',
  },
  scrollIndicator: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #3b82f6, #9333ea, #ec4899)',
    zIndex: 100,
    transition: 'width 0.1s ease-out',
  },
}
