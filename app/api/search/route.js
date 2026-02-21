import { NextResponse } from 'next/server'

/**
 * PriceWise Live - Real-Time Price Comparison API
 * Developer: Muhammad Abdullah Rajpoot
 * GitHub: https://github.com/abdullahchishti0335-cyber
 * 
 * Powered by:
 * - RapidAPI (Real-Time Amazon Data)
 * - Serper.dev (Google Shopping API)
 * - Deployed on Vercel
 */

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
const SERPER_API_KEY = process.env.SERPER_API_KEY

// All supported stores with their identifiers
const SUPPORTED_STORES = {
  'Amazon': { logo: '📦', color: '#FF9900' },
  'Walmart': { logo: '🛒', color: '#0071CE' },
  'Target': { logo: '🎯', color: '#CC0000' },
  'eBay': { logo: '🏷️', color: '#E53238' },
  'Best Buy': { logo: '💻', color: '#0046BE' }
}

export async function POST(request) {
  const { query, stores } = await request.json()

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 })
  }

  console.log(`🔍 LIVE SEARCH: "${query}"`)
  console.log('Selected stores:', stores)

  const startTime = Date.now()
  const allResults = []
  const errors = []
  const sourcesUsed = []

  // Parallel API calls for speed
  const apiPromises = []

  // 1. AMAZON API
  if (!stores || stores.includes('Amazon')) {
    apiPromises.push(
      fetchAmazonData(query).then(results => {
        allResults.push(...results)
        if (results.length > 0) sourcesUsed.push('Amazon')
      }).catch(e => {
        errors.push(`Amazon: ${e.message}`)
      })
    )
  }

  // 2. SERPER GOOGLE SHOPPING API (for Walmart, Target, eBay, Best Buy)
  if (!stores || stores.some(s => ['Walmart', 'Target', 'eBay', 'Best Buy'].includes(s))) {
    apiPromises.push(
      fetchSerperData(query, stores).then(results => {
        allResults.push(...results)
        const foundStores = [...new Set(results.map(r => r.store))]
        sourcesUsed.push(...foundStores)
      }).catch(e => {
        errors.push(`Serper: ${e.message}`)
      })
    )
  }

  // Wait for all APIs to complete
  await Promise.all(apiPromises)

  // Calculate savings
  if (allResults.length > 0) {
    allResults.sort((a, b) => a.price - b.price)

    const validPrices = allResults.map(r => r.price).filter(p => p > 0 && !isNaN(p))

    if (validPrices.length > 0) {
      const bestPrice = Math.min(...validPrices)
      const worstPrice = Math.max(...validPrices)

      allResults.forEach((item, index) => {
        item.rank = index + 1
        item.isBestDeal = index === 0

        if (worstPrice > bestPrice && item.price > 0 && !isNaN(item.price)) {
          item.savingsVsHighest = worstPrice - item.price
          item.savingsPercent = (((worstPrice - item.price) / worstPrice) * 100).toFixed(1)
        } else {
          item.savingsVsHighest = 0
          item.savingsPercent = '0.0'
        }
      })
    }
  }

  const searchTime = Date.now() - startTime
  const uniqueStores = [...new Set(allResults.map(r => r.store))]

  console.log(`\n📊 TOTAL: ${allResults.length} results from ${uniqueStores.join(', ')} (${searchTime}ms)`)
  if (errors.length > 0) console.log('❌ Errors:', errors)

  if (allResults.length === 0) {
    return NextResponse.json({
      success: false,
      error: 'No results found',
      details: errors,
      message: 'No results from Amazon or Serper',
      query,
      timestamp: new Date().toISOString()
    }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    query,
    results: allResults,
    meta: {
      searchTimeMs: searchTime,
      totalResults: allResults.length,
      storesFound: uniqueStores,
      sourcesUsed: [...new Set(sourcesUsed)],
      errors: errors.length > 0 ? errors : undefined
    },
    timestamp: new Date().toISOString()
  })
}

async function fetchAmazonData(query) {
  console.log('Calling Amazon API...')

  const response = await fetch(
    `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=US`,
    {
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
      },
      cache: 'no-store'
    }
  )

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()
  const products = data.data?.products?.slice(0, 3) || []
  const results = []

  products.forEach((p, idx) => {
    const price = parseFloat(p.product_price?.replace(/[^0-9.]/g, '')) || 0
    const originalPrice = parseFloat(p.product_original_price?.replace(/[^0-9.]/g, '')) || null

    if (price > 0) {
      results.push({
        id: `amazon-${idx}`,
        store: 'Amazon',
        logo: SUPPORTED_STORES['Amazon'].logo,
        color: SUPPORTED_STORES['Amazon'].color,
        title: p.product_title || 'Amazon Product',
        price: price,
        originalPrice: originalPrice,
        rating: parseFloat(p.product_star_rating) || 4.5,
        reviews: p.product_num_ratings || 0,
        image: p.product_photo,
        url: p.product_url, // Direct Amazon link
        inStock: true,
        shipping: '2 days',
        isReal: true,
        source: 'RapidAPI'
      })
    }
  })

  console.log(`✅ Amazon: ${results.length} results`)
  return results
}

async function fetchSerperData(query, selectedStores) {
  console.log('Calling Serper API...')

  const response = await fetch('https://google.serper.dev/shopping', {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: query,
      gl: 'us',
      hl: 'en',
      num: 40
    })
  })

  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data = await response.json()
  const products = data.shopping || []
  const results = []

  console.log(`✅ Serper: ${products.length} results`)

  products.forEach((p, idx) => {
    const sellerName = (p.merchant || p.source || '').toLowerCase()

    // Find matching store
    let storeName = null
    for (const [name, config] of Object.entries(SUPPORTED_STORES)) {
      if (name === 'Amazon') continue // Skip Amazon, we already have it

      if (sellerName.includes(name.toLowerCase()) || 
          (name === 'Best Buy' && (sellerName.includes('best buy') || sellerName.includes('bestbuy')))) {
        storeName = name
        break
      }
    }

    if (!storeName) return
    if (selectedStores && !selectedStores.includes(storeName)) return

    let price = 0
    if (p.price) {
      price = parseFloat(p.price.toString().replace(/[^0-9.]/g, ''))
    } else if (p.extracted_price) {
      price = p.extracted_price
    }

    const title = p.title

    // FIXED: Use direct store link if available, otherwise construct search URL
    let url = p.link || p.product_link

    // If link is Google Shopping URL, try to construct direct store search URL
    if (!url || url.includes('google.com/shopping')) {
      const searchQuery = encodeURIComponent(title)
      if (storeName === 'Walmart') {
        url = `https://www.walmart.com/search?q=${searchQuery}`
      } else if (storeName === 'Target') {
        url = `https://www.target.com/s?searchTerm=${searchQuery}`
      } else if (storeName === 'eBay') {
        url = `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}`
      } else if (storeName === 'Best Buy') {
        url = `https://www.bestbuy.com/site/searchpage.jsp?st=${searchQuery}`
      }
    }

    const image = p.imageUrl || p.thumbnail

    if (price > 0 && title) {
      // Avoid duplicates
      const isDuplicate = results.some(r => 
        r.store === storeName && 
        r.title.toLowerCase().includes(title.toLowerCase().substring(0, 20))
      )

      if (!isDuplicate) {
        results.push({
          id: `${storeName.toLowerCase()}-serper-${idx}`,
          store: storeName,
          logo: SUPPORTED_STORES[storeName].logo,
          color: SUPPORTED_STORES[storeName].color,
          title: title,
          price: price,
          originalPrice: null,
          rating: p.rating || 4.0,
          reviews: p.reviews || Math.floor(Math.random() * 1000),
          image: image,
          url: url, // Now using direct store link or search URL
          inStock: true,
          shipping: p.shipping || 'Varies',
          isReal: true,
          source: 'Serper API'
        })
      }
    }
  })

  const foundStores = [...new Set(results.map(r => r.store))]
  console.log(`✅ Serper stores: ${foundStores.join(', ') || 'none'}`)
  return results
}