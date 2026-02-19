import { NextResponse } from 'next/server'

// Simulated database of products across different stores
const productsDB = [
  {
    id: 1,
    name: "Sony WH-1000XM5",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500",
    stores: [
      { name: "Amazon", price: 348.00, currency: "$", url: "#", rating: 4.8, reviews: 12543, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 349.99, currency: "$", url: "#", rating: 4.7, reviews: 8921, shipping: "3 days", inStock: true },
      { name: "Target", price: 359.99, currency: "$", url: "#", rating: 4.6, reviews: 3421, shipping: "5 days", inStock: false },
      { name: "Walmart", price: 345.00, currency: "$", url: "#", rating: 4.5, reviews: 5678, shipping: "2 days", inStock: true }
    ],
    priceHistory: [
      { date: '2024-01', price: 399 },
      { date: '2024-02', price: 389 },
      { date: '2024-03', price: 379 },
      { date: '2024-04', price: 369 },
      { date: '2024-05', price: 359 },
      { date: '2024-06', price: 348 }
    ]
  },
  {
    id: 2,
    name: "MacBook Air M3",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
    stores: [
      { name: "Apple", price: 1099.00, currency: "$", url: "#", rating: 4.9, reviews: 3421, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 1049.00, currency: "$", url: "#", rating: 4.8, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 1099.99, currency: "$", url: "#", rating: 4.8, reviews: 2341, shipping: "3 days", inStock: true },
      { name: "B&H Photo", price: 1029.00, currency: "$", url: "#", rating: 4.7, reviews: 1234, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: '2024-01', price: 1199 },
      { date: '2024-02', price: 1199 },
      { date: '2024-03', price: 1149 },
      { date: '2024-04', price: 1099 },
      { date: '2024-05', price: 1099 },
      { date: '2024-06', price: 1029 }
    ]
  },
  {
    id: 3,
    name: "Nike Air Max 270",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    stores: [
      { name: "Nike", price: 150.00, currency: "$", url: "#", rating: 4.6, reviews: 8765, shipping: "5 days", inStock: true },
      { name: "Foot Locker", price: 140.00, currency: "$", url: "#", rating: 4.5, reviews: 4321, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 135.00, currency: "$", url: "#", rating: 4.4, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "Zappos", price: 150.00, currency: "$", url: "#", rating: 4.7, reviews: 2134, shipping: "4 days", inStock: false }
    ],
    priceHistory: [
      { date: '2024-01', price: 160 },
      { date: '2024-02', price: 160 },
      { date: '2024-03', price: 155 },
      { date: '2024-04', price: 150 },
      { date: '2024-05', price: 140 },
      { date: '2024-06', price: 135 }
    ]
  },
  {
    id: 4,
    name: "Samsung 65\" QLED 4K TV",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500",
    stores: [
      { name: "Samsung", price: 1299.99, currency: "$", url: "#", rating: 4.7, reviews: 2341, shipping: "1 week", inStock: true },
      { name: "Best Buy", price: 1199.99, currency: "$", url: "#", rating: 4.6, reviews: 5678, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 1149.00, currency: "$", url: "#", rating: 4.5, reviews: 9876, shipping: "2 days", inStock: true },
      { name: "Costco", price: 1099.99, currency: "$", url: "#", rating: 4.8, reviews: 3456, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: '2024-01', price: 1499 },
      { date: '2024-02', price: 1399 },
      { date: '2024-03', price: 1349 },
      { date: '2024-04', price: 1299 },
      { date: '2024-05', price: 1199 },
      { date: '2024-06', price: 1099 }
    ]
  },
  {
    id: 5,
    name: "Dyson V15 Detect",
    category: "Home",
    image: "https://images.unsplash.com/photo-1558317374-a3545eca46f2?w=500",
    stores: [
      { name: "Dyson", price: 749.99, currency: "$", url: "#", rating: 4.8, reviews: 5432, shipping: "3 days", inStock: true },
      { name: "Best Buy", price: 699.99, currency: "$", url: "#", rating: 4.7, reviews: 3210, shipping: "2 days", inStock: true },
      { name: "Amazon", price: 679.00, currency: "$", url: "#", rating: 4.6, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Target", price: 749.99, currency: "$", url: "#", rating: 4.5, reviews: 1234, shipping: "5 days", inStock: false }
    ],
    priceHistory: [
      { date: '2024-01', price: 799 },
      { date: '2024-02', price: 799 },
      { date: '2024-03', price: 779 },
      { date: '2024-04', price: 749 },
      { date: '2024-05', price: 699 },
      { date: '2024-06', price: 679 }
    ]
  },
  {
    id: 6,
    name: "PlayStation 5",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500",
    stores: [
      { name: "Sony", price: 499.99, currency: "$", url: "#", rating: 4.9, reviews: 45678, shipping: "1 week", inStock: true },
      { name: "Best Buy", price: 499.99, currency: "$", url: "#", rating: 4.8, reviews: 23456, shipping: "3 days", inStock: false },
      { name: "Amazon", price: 549.00, currency: "$", url: "#", rating: 4.7, reviews: 67890, shipping: "2 days", inStock: true },
      { name: "GameStop", price: 499.99, currency: "$", url: "#", rating: 4.6, reviews: 12345, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: '2024-01', price: 499 },
      { date: '2024-02', price: 499 },
      { date: '2024-03', price: 499 },
      { date: '2024-04', price: 499 },
      { date: '2024-05', price: 499 },
      { date: '2024-06', price: 499 }
    ]
  }
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const sortBy = searchParams.get('sort') || 'relevance'
  
  let filtered = productsDB

  // Search filter
  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Category filter
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

  // Sorting
  if (sortBy === 'price-low') {
    filtered = filtered.sort((a, b) => {
      const minA = Math.min(...a.stores.map(s => s.price))
      const minB = Math.min(...b.stores.map(s => s.price))
      return minA - minB
    })
  } else if (sortBy === 'price-high') {
    filtered = filtered.sort((a, b) => {
      const maxA = Math.max(...a.stores.map(s => s.price))
      const maxB = Math.max(...b.stores.map(s => s.price))
      return maxB - maxA
    })
  } else if (sortBy === 'rating') {
    filtered = filtered.sort((a, b) => {
      const avgA = a.stores.reduce((acc, s) => acc + s.rating, 0) / a.stores.length
      const avgB = b.stores.reduce((acc, s) => acc + s.rating, 0) / b.stores.length
      return avgB - avgA
    })
  }

  // Add best deal calculation
  const enriched = filtered.map(product => {
    const prices = product.stores.map(s => s.price)
    const bestPrice = Math.min(...prices)
    const worstPrice = Math.max(...prices)
    const savings = worstPrice - bestPrice
    const savingsPercent = ((savings / worstPrice) * 100).toFixed(1)
    
    return {
      ...product,
      bestPrice,
      worstPrice,
      savings,
      savingsPercent,
      bestStore: product.stores.find(s => s.price === bestPrice)
    }
  })

  return NextResponse.json({ 
    products: enriched, 
    total: enriched.length,
    query: query || null 
  })
}