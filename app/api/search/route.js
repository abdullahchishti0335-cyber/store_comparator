import { NextResponse } from 'next/server'

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY

// Fallback realistic mock data for demo purposes
const MOCK_DATA = {
  ebay: [
    { title: 'Apple iPhone 15 Pro Max 256GB - Unlocked', price: 1199, image: 'https://i.ebayimg.com/thumbs/images/g/8YUAAOSwHghl7lPq/s-l225.jpg', url: 'https://www.ebay.com/sch/i.html?_nkw=iphone' },
    { title: 'Apple iPhone 14 Pro 128GB - Excellent Condition', price: 899, image: 'https://i.ebayimg.com/thumbs/images/g/8YUAAOSwHghl7lPq/s-l225.jpg', url: 'https://www.ebay.com/sch/i.html?_nkw=iphone' },
    { title: 'iPhone 13 128GB - Factory Unlocked', price: 699, image: 'https://i.ebayimg.com/thumbs/images/g/8YUAAOSwHghl7lPq/s-l225.jpg', url: 'https://www.ebay.com/sch/i.html?_nkw=iphone' }
  ],
  walmart: [
    { title: 'Apple iPhone 15 Pro Max, 256GB, Black Titanium', price: 1199, image: 'https://i5.walmartimages.com/asr/12345.jpg', url: 'https://www.walmart.com/search?q=iphone' },
    { title: 'Apple iPhone 14, 128GB, Midnight', price: 799, image: 'https://i5.walmartimages.com/asr/12345.jpg', url: 'https://www.walmart.com/search?q=iphone' },
    { title: 'Straight Talk Apple iPhone SE (3rd Gen), 64GB', price: 379, image: 'https://i5.walmartimages.com/asr/12345.jpg', url: 'https://www.walmart.com/search?q=iphone' }
  ],
  target: [
    { title: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium', price: 1199, image: 'https://target.scene7.com/is/image/Target/12345', url: 'https://www.target.com/s?searchTerm=iphone' },
    { title: 'Apple iPhone 14 128GB - Midnight', price: 799, image: 'https://target.scene7.com/is/image/Target/12345', url: 'https://www.target.com/s?searchTerm=iphone' },
    { title: 'Apple iPhone 13 128GB - Blue', price: 699, image: 'https://target.scene7.com/is/image/Target/12345', url: 'https://www.target.com/s?searchTerm=iphone' }
  ]
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
  const usedMockData = []

  // 1. AMAZON API - REAL DATA (Working)
  if (!stores || stores.includes('Amazon')) {
    try {
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

      if (response.ok) {
        const data = await response.json()
        const products = data.data?.products?.slice(0, 3) || []

        products.forEach((p, idx) => {
          const price = parseFloat(p.product_price?.replace(/[^0-9.]/g, '')) || 0
          const originalPrice = parseFloat(p.product_original_price?.replace(/[^0-9.]/g, '')) || null

          if (price > 0) {
            allResults.push({
              id: `amazon-${idx}`,
              store: 'Amazon',
              logo: '📦',
              color: '#FF9900',
              title: p.product_title || 'Amazon Product',
              price: price,
              originalPrice: originalPrice,
              rating: parseFloat(p.product_star_rating) || 4.5,
              reviews: p.product_num_ratings || 0,
              image: p.product_photo,
              url: p.product_url,
              inStock: true,
              shipping: '2 days',
              isReal: true,
              source: 'RapidAPI (Real)'
            })
          }
        })
        console.log(`✅ Amazon: ${products.length} results`)
      } else {
        errors.push(`Amazon: HTTP ${response.status}`)
      }
    } catch (e) {
      errors.push(`Amazon: ${e.message}`)
    }
  }

  // 2. EBAY - Try API first, fallback to mock if fails
  if (!stores || stores.includes('eBay')) {
    let ebaySuccess = false

    try {
      console.log('Trying eBay API...')
      const response = await fetch(
        `https://ebay-search-result.p.rapidapi.com/search/${encodeURIComponent(query)}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'ebay-search-result.p.rapidapi.com'
          },
          cache: 'no-store'
        }
      )

      if (response.ok) {
        const data = await response.json()
        const items = data.results || []

        if (items.length > 0) {
          items.slice(0, 3).forEach((p, idx) => {
            let price = 0
            if (p.price) {
              if (typeof p.price === 'string') price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
              else if (typeof p.price === 'number') price = p.price
            }

            if (price > 0 && p.title) {
              allResults.push({
                id: `ebay-${idx}`,
                store: 'eBay',
                logo: '🏷️',
                color: '#E53238',
                title: p.title,
                price: price,
                originalPrice: null,
                rating: 4.4,
                reviews: Math.floor(Math.random() * 5000),
                image: p.image,
                url: p.url,
                inStock: true,
                shipping: 'Varies',
                isReal: true,
                source: 'RapidAPI (Real)'
              })
            }
          })
          ebaySuccess = true
          console.log(`✅ eBay: ${items.length} results`)
        }
      }
    } catch (e) {
      console.log('eBay API failed:', e.message)
    }

    // Fallback to mock data if API fails or returns empty
    if (!ebaySuccess) {
      console.log('⚠️ Using eBay mock data')
      usedMockData.push('eBay')
      MOCK_DATA.ebay.forEach((p, idx) => {
        allResults.push({
          id: `ebay-${idx}`,
          store: 'eBay',
          logo: '🏷️',
          color: '#E53238',
          title: p.title,
          price: p.price,
          originalPrice: null,
          rating: 4.4,
          reviews: Math.floor(Math.random() * 5000),
          image: p.image,
          url: p.url,
          inStock: true,
          shipping: 'Varies',
          isReal: false,
          source: 'Mock Data (Demo)'
        })
      })
    }
  }

  // 3. WALMART - Try API first, fallback to mock if fails
  if (!stores || stores.includes('Walmart')) {
    let walmartSuccess = false

    try {
      console.log('Trying Walmart API...')
      // Try alternative endpoint
      const response = await fetch(
        `https://walmart28.p.rapidapi.com/products/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'walmart28.p.rapidapi.com'
          },
          cache: 'no-store'
        }
      )

      if (response.ok) {
        const data = await response.json()
        const items = data.products || data.items || []

        if (items.length > 0) {
          items.slice(0, 3).forEach((p, idx) => {
            let price = 0
            if (p.price) {
              if (typeof p.price === 'string') price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
              else if (typeof p.price === 'number') price = p.price
            }

            if (price > 0 && p.title) {
              allResults.push({
                id: `walmart-${idx}`,
                store: 'Walmart',
                logo: '🛒',
                color: '#0071CE',
                title: p.title,
                price: price,
                originalPrice: null,
                rating: 4.3,
                reviews: Math.floor(Math.random() * 3000),
                image: p.image,
                url: p.url,
                inStock: true,
                shipping: '2 days',
                isReal: true,
                source: 'RapidAPI (Real)'
              })
            }
          })
          walmartSuccess = true
          console.log(`✅ Walmart: ${items.length} results`)
        }
      }
    } catch (e) {
      console.log('Walmart API failed:', e.message)
    }

    // Fallback to mock data
    if (!walmartSuccess) {
      console.log('⚠️ Using Walmart mock data')
      usedMockData.push('Walmart')
      MOCK_DATA.walmart.forEach((p, idx) => {
        allResults.push({
          id: `walmart-${idx}`,
          store: 'Walmart',
          logo: '🛒',
          color: '#0071CE',
          title: p.title,
          price: p.price,
          originalPrice: null,
          rating: 4.3,
          reviews: Math.floor(Math.random() * 3000),
          image: p.image,
          url: p.url,
          inStock: true,
          shipping: '2 days',
          isReal: false,
          source: 'Mock Data (Demo)'
        })
      })
    }
  }

  // 4. TARGET - Try API first, fallback to mock if fails
  if (!stores || stores.includes('Target')) {
    let targetSuccess = false

    try {
      console.log('Trying Target API...')
      const response = await fetch(
        `https://real-time-product-search.p.rapidapi.com/search-v2?q=${encodeURIComponent(query)}&country=us`,
        {
          headers: {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'real-time-product-search.p.rapidapi.com'
          },
          cache: 'no-store'
        }
      )

      if (response.ok) {
        const data = await response.json()
        const products = data.data?.products || []

        // Filter for Target products
        const targetProducts = products.filter(p => 
          p.source?.toLowerCase().includes('target') || 
          p.link?.includes('target.com')
        )

        if (targetProducts.length > 0) {
          targetProducts.slice(0, 3).forEach((p, idx) => {
            const price = p.price || p.offer?.price || 0
            const title = p.title || p.name
            const url = p.link || p.url

            if (price > 0 && title) {
              allResults.push({
                id: `target-${idx}`,
                store: 'Target',
                logo: '🎯',
                color: '#CC0000',
                title: title,
                price: price,
                originalPrice: null,
                rating: p.rating?.average || 4.5,
                reviews: p.reviews_count || Math.floor(Math.random() * 2000),
                image: p.thumbnail || p.image,
                url: url,
                inStock: true,
                shipping: '2 days',
                isReal: true,
                source: 'RapidAPI (Real)'
              })
            }
          })
          targetSuccess = true
          console.log(`✅ Target: ${targetProducts.length} results`)
        }
      }
    } catch (e) {
      console.log('Target API failed:', e.message)
    }

    // Fallback to mock data
    if (!targetSuccess) {
      console.log('⚠️ Using Target mock data')
      usedMockData.push('Target')
      MOCK_DATA.target.forEach((p, idx) => {
        allResults.push({
          id: `target-${idx}`,
          store: 'Target',
          logo: '🎯',
          color: '#CC0000',
          title: p.title,
          price: p.price,
          originalPrice: null,
          rating: 4.5,
          reviews: Math.floor(Math.random() * 2000),
          image: p.image,
          url: p.url,
          inStock: true,
          shipping: '2 days',
          isReal: false,
          source: 'Mock Data (Demo)'
        })
      })
    }
  }

  // Calculate savings and rankings
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

  console.log(`\n📊 TOTAL: ${allResults.length} results from ${[...new Set(allResults.map(r => r.store))].join(', ')}`)
  if (usedMockData.length > 0) console.log(`⚠️ Mock data used for: ${usedMockData.join(', ')}`)
  if (errors.length > 0) console.log('❌ Errors:', errors)

  return NextResponse.json({
    success: true,
    query,
    results: allResults,
    meta: {
      searchTimeMs: searchTime,
      totalResults: allResults.length,
      storesFound: [...new Set(allResults.map(r => r.store))],
      mockDataUsed: usedMockData,
      errors: errors.length > 0 ? errors : undefined
    },
    timestamp: new Date().toISOString()
  })
}