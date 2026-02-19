import { NextResponse } from 'next/server'

// In-memory price history (use Redis/DB in production)
const priceHistory = new Map()

export async function POST(request) {
  try {
    const { productId, productName, currentPrice, store, targetPrice, email } = await request.json()
    
    const trackingId = `${productId}-${Date.now()}`
    
    const trackingData = {
      id: trackingId,
      productId,
      productName,
      store,
      currentPrice,
      targetPrice,
      email,
      createdAt: new Date().toISOString(),
      history: [{ price: currentPrice, date: new Date().toISOString() }],
      alerts: []
    }
    
    priceHistory.set(trackingId, trackingData)
    
    // Simulate alert check
    if (currentPrice <= targetPrice) {
      trackingData.alerts.push({
        type: 'TARGET_REACHED',
        message: `Price dropped to $${currentPrice}!`,
        date: new Date().toISOString()
      })
    }
    
    return NextResponse.json({
      success: true,
      trackingId,
      message: 'Price tracking activated',
      data: trackingData
    })
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (id && priceHistory.has(id)) {
    return NextResponse.json(priceHistory.get(id))
  }
  
  return NextResponse.json({
    totalTracked: priceHistory.size,
    activeAlerts: Array.from(priceHistory.values()).filter(t => t.alerts.length > 0).length
  })
}