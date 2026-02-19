import { NextResponse } from 'next/server'

const productsDB = [
  // ELECTRONICS (10 items)
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80",
    stores: [
      { name: "Amazon", price: 348.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 12543, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 349.99, currency: "$", url: "https://bestbuy.com", rating: 4.7, reviews: 8921, shipping: "3 days", inStock: true },
      { name: "Target", price: 359.99, currency: "$", url: "https://target.com", rating: 4.6, reviews: 3421, shipping: "5 days", inStock: false },
      { name: "Sony Direct", price: 399.99, currency: "$", url: "https://sony.com", rating: 4.9, reviews: 2100, shipping: "1 week", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 399 }, { date: 'Feb', price: 389 }, { date: 'Mar', price: 379 },
      { date: 'Apr', price: 369 }, { date: 'May', price: 359 }, { date: 'Jun', price: 348 }
    ]
  },
  {
    id: 2,
    name: "MacBook Air 15-inch M3 Chip",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    stores: [
      { name: "Apple", price: 1299.00, currency: "$", url: "https://apple.com", rating: 4.9, reviews: 3421, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 1199.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 1249.99, currency: "$", url: "https://bestbuy.com", rating: 4.8, reviews: 2341, shipping: "3 days", inStock: true },
      { name: "B&H Photo", price: 1179.00, currency: "$", url: "https://bhphotovideo.com", rating: 4.7, reviews: 1234, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 1299 }, { date: 'Feb', price: 1299 }, { date: 'Mar', price: 1249 },
      { date: 'Apr', price: 1199 }, { date: 'May', price: 1199 }, { date: 'Jun', price: 1179 }
    ]
  },
  {
    id: 3,
    name: "Samsung 65-inch QN90C Neo QLED 4K TV",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
    stores: [
      { name: "Samsung", price: 1799.99, currency: "$", url: "https://samsung.com", rating: 4.7, reviews: 2341, shipping: "1 week", inStock: true },
      { name: "Best Buy", price: 1699.99, currency: "$", url: "https://bestbuy.com", rating: 4.6, reviews: 5678, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 1649.00, currency: "$", url: "https://amazon.com", rating: 4.5, reviews: 9876, shipping: "2 days", inStock: true },
      { name: "Costco", price: 1599.99, currency: "$", url: "https://costco.com", rating: 4.8, reviews: 3456, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 2199 }, { date: 'Feb', price: 1999 }, { date: 'Mar', price: 1899 },
      { date: 'Apr', price: 1799 }, { date: 'May', price: 1699 }, { date: 'Jun', price: 1599 }
    ]
  },
  {
    id: 4,
    name: "iPad Pro 12.9-inch M2 Chip",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    stores: [
      { name: "Apple", price: 1099.00, currency: "$", url: "https://apple.com", rating: 4.9, reviews: 8765, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 1049.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 1079.99, currency: "$", url: "https://bestbuy.com", rating: 4.8, reviews: 5678, shipping: "3 days", inStock: true },
      { name: "B&H Photo", price: 1029.00, currency: "$", url: "https://bhphotovideo.com", rating: 4.7, reviews: 3456, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 1099 }, { date: 'Feb', price: 1099 }, { date: 'Mar', price: 1079 },
      { date: 'Apr', price: 1049 }, { date: 'May', price: 1049 }, { date: 'Jun', price: 1029 }
    ]
  },
  {
    id: 5,
    name: "Canon EOS R6 Mirrorless Camera",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    stores: [
      { name: "Canon", price: 2499.00, currency: "$", url: "https://canon.com", rating: 4.9, reviews: 1234, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 2299.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 3456, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 2399.99, currency: "$", url: "https://bestbuy.com", rating: 4.7, reviews: 2345, shipping: "3 days", inStock: true },
      { name: "Adorama", price: 2249.00, currency: "$", url: "https://adorama.com", rating: 4.8, reviews: 1890, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 2499 }, { date: 'Feb', price: 2499 }, { date: 'Mar', price: 2399 },
      { date: 'Apr', price: 2299 }, { date: 'May', price: 2299 }, { date: 'Jun', price: 2249 }
    ]
  },
  {
    id: 6,
    name: "Bose QuietComfort Ultra Earbuds",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
    stores: [
      { name: "Bose", price: 299.00, currency: "$", url: "https://bose.com", rating: 4.7, reviews: 5678, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 279.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 8901, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 289.99, currency: "$", url: "https://bestbuy.com", rating: 4.5, reviews: 4321, shipping: "2 days", inStock: true },
      { name: "Target", price: 299.99, currency: "$", url: "https://target.com", rating: 4.4, reviews: 2345, shipping: "5 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 299 }, { date: 'Feb', price: 299 }, { date: 'Mar', price: 289 },
      { date: 'Apr', price: 279 }, { date: 'May', price: 279 }, { date: 'Jun', price: 279 }
    ]
  },
  {
    id: 7,
    name: "DJI Mavic 3 Pro Drone",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    stores: [
      { name: "DJI", price: 2199.00, currency: "$", url: "https://dji.com", rating: 4.9, reviews: 2345, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 2099.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 2149.99, currency: "$", url: "https://bestbuy.com", rating: 4.7, reviews: 3456, shipping: "3 days", inStock: true },
      { name: "B&H Photo", price: 2049.00, currency: "$", url: "https://bhphotovideo.com", rating: 4.8, reviews: 2890, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 2199 }, { date: 'Feb', price: 2199 }, { date: 'Mar', price: 2149 },
      { date: 'Apr', price: 2099 }, { date: 'May', price: 2099 }, { date: 'Jun', price: 2049 }
    ]
  },
  {
    id: 8,
    name: "Nintendo Switch OLED Model",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800&q=80",
    stores: [
      { name: "Nintendo", price: 349.99, currency: "$", url: "https://nintendo.com", rating: 4.8, reviews: 12345, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 339.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 23456, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 349.99, currency: "$", url: "https://bestbuy.com", rating: 4.6, reviews: 18765, shipping: "2 days", inStock: true },
      { name: "Target", price: 349.99, currency: "$", url: "https://target.com", rating: 4.5, reviews: 9876, shipping: "3 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 349 }, { date: 'Feb', price: 349 }, { date: 'Mar', price: 349 },
      { date: 'Apr', price: 339 }, { date: 'May', price: 339 }, { date: 'Jun', price: 339 }
    ]
  },
  {
    id: 9,
    name: "GoPro HERO12 Black",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1564466021188-1e4b8a3b0aa8?w=800&q=80",
    stores: [
      { name: "GoPro", price: 399.99, currency: "$", url: "https://gopro.com", rating: 4.6, reviews: 4567, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 379.00, currency: "$", url: "https://amazon.com", rating: 4.5, reviews: 7890, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 389.99, currency: "$", url: "https://bestbuy.com", rating: 4.4, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "REI", price: 399.99, currency: "$", url: "https://rei.com", rating: 4.7, reviews: 2345, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 399 }, { date: 'Feb', price: 399 }, { date: 'Mar', price: 389 },
      { date: 'Apr', price: 379 }, { date: 'May', price: 379 }, { date: 'Jun', price: 379 }
    ]
  },
  {
    id: 10,
    name: "Sonos Era 300 Smart Speaker",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    stores: [
      { name: "Sonos", price: 449.00, currency: "$", url: "https://sonos.com", rating: 4.8, reviews: 3456, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 429.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 449.99, currency: "$", url: "https://bestbuy.com", rating: 4.6, reviews: 4321, shipping: "2 days", inStock: true },
      { name: "Crutchfield", price: 449.00, currency: "$", url: "https://crutchfield.com", rating: 4.9, reviews: 1234, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 449 }, { date: 'Feb', price: 449 }, { date: 'Mar', price: 439 },
      { date: 'Apr', price: 429 }, { date: 'May', price: 429 }, { date: 'Jun', price: 429 }
    ]
  },

  // FASHION (8 items)
  {
    id: 11,
    name: "Nike Air Max 270 Running Shoes",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    stores: [
      { name: "Nike", price: 150.00, currency: "$", url: "https://nike.com", rating: 4.6, reviews: 8765, shipping: "5 days", inStock: true },
      { name: "Foot Locker", price: 140.00, currency: "$", url: "https://footlocker.com", rating: 4.5, reviews: 4321, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 135.00, currency: "$", url: "https://amazon.com", rating: 4.4, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "Zappos", price: 150.00, currency: "$", url: "https://zappos.com", rating: 4.7, reviews: 2134, shipping: "4 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 160 }, { date: 'Feb', price: 160 }, { date: 'Mar', price: 155 },
      { date: 'Apr', price: 150 }, { date: 'May', price: 140 }, { date: 'Jun', price: 135 }
    ]
  },
  {
    id: 12,
    name: "Adidas Ultraboost Light Running Shoes",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
    stores: [
      { name: "Adidas", price: 190.00, currency: "$", url: "https://adidas.com", rating: 4.7, reviews: 5432, shipping: "5 days", inStock: true },
      { name: "Amazon", price: 170.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Foot Locker", price: 180.00, currency: "$", url: "https://footlocker.com", rating: 4.5, reviews: 3210, shipping: "3 days", inStock: true },
      { name: "Zappos", price: 175.00, currency: "$", url: "https://zappos.com", rating: 4.6, reviews: 2345, shipping: "4 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 190 }, { date: 'Feb', price: 190 }, { date: 'Mar', price: 185 },
      { date: 'Apr', price: 180 }, { date: 'May', price: 175 }, { date: 'Jun', price: 170 }
    ]
  },
  {
    id: 13,
    name: "Ray-Ban Aviator Classic Sunglasses",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
    stores: [
      { name: "Ray-Ban", price: 163.00, currency: "$", url: "https://ray-ban.com", rating: 4.8, reviews: 12345, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 145.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 23456, shipping: "2 days", inStock: true },
      { name: "Sunglass Hut", price: 163.00, currency: "$", url: "https://sunglasshut.com", rating: 4.6, reviews: 8765, shipping: "3 days", inStock: true },
      { name: "Nordstrom", price: 163.00, currency: "$", url: "https://nordstrom.com", rating: 4.5, reviews: 5432, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 163 }, { date: 'Feb', price: 163 }, { date: 'Mar', price: 155 },
      { date: 'Apr', price: 145 }, { date: 'May', price: 145 }, { date: 'Jun', price: 145 }
    ]
  },
  {
    id: 14,
    name: "Levi's 501 Original Fit Jeans",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&q=80",
    stores: [
      { name: "Levi's", price: 59.50, currency: "$", url: "https://levi.com", rating: 4.5, reviews: 23456, shipping: "5 days", inStock: true },
      { name: "Amazon", price: 49.99, currency: "$", url: "https://amazon.com", rating: 4.4, reviews: 45678, shipping: "2 days", inStock: true },
      { name: "Macy's", price: 59.50, currency: "$", url: "https://macys.com", rating: 4.3, reviews: 12345, shipping: "3 days", inStock: true },
      { name: "Kohl's", price: 54.99, currency: "$", url: "https://kohls.com", rating: 4.2, reviews: 9876, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 59 }, { date: 'Feb', price: 59 }, { date: 'Mar', price: 55 },
      { date: 'Apr', price: 49 }, { date: 'May', price: 49 }, { date: 'Jun', price: 49 }
    ]
  },
  {
    id: 15,
    name: "North Face 1996 Retro Nuptse Jacket",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    stores: [
      { name: "North Face", price: 320.00, currency: "$", url: "https://thenorthface.com", rating: 4.8, reviews: 8765, shipping: "5 days", inStock: true },
      { name: "Amazon", price: 289.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "REI", price: 320.00, currency: "$", url: "https://rei.com", rating: 4.6, reviews: 5678, shipping: "3 days", inStock: true },
      { name: "Backcountry", price: 299.00, currency: "$", url: "https://backcountry.com", rating: 4.5, reviews: 4321, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 320 }, { date: 'Feb', price: 320 }, { date: 'Mar', price: 305 },
      { date: 'Apr', price: 289 }, { date: 'May', price: 289 }, { date: 'Jun', price: 289 }
    ]
  },
  {
    id: 16,
    name: "Casio G-Shock GA2100 Watch",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
    stores: [
      { name: "Casio", price: 99.00, currency: "$", url: "https://casio.com", rating: 4.9, reviews: 12345, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 89.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 23456, shipping: "2 days", inStock: true },
      { name: "Walmart", price: 95.00, currency: "$", url: "https://walmart.com", rating: 4.7, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Target", price: 99.00, currency: "$", url: "https://target.com", rating: 4.6, reviews: 5432, shipping: "3 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 99 }, { date: 'Feb', price: 99 }, { date: 'Mar', price: 95 },
      { date: 'Apr', price: 89 }, { date: 'May', price: 89 }, { date: 'Jun', price: 89 }
    ]
  },
  {
    id: 17,
    name: "Coach Tabby Shoulder Bag 26",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    stores: [
      { name: "Coach", price: 450.00, currency: "$", url: "https://coach.com", rating: 4.7, reviews: 3456, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 399.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "Nordstrom", price: 450.00, currency: "$", url: "https://nordstrom.com", rating: 4.5, reviews: 4321, shipping: "5 days", inStock: true },
      { name: "Macy's", price: 425.00, currency: "$", url: "https://macys.com", rating: 4.4, reviews: 2890, shipping: "3 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 450 }, { date: 'Feb', price: 450 }, { date: 'Mar', price: 425 },
      { date: 'Apr', price: 399 }, { date: 'May', price: 399 }, { date: 'Jun', price: 399 }
    ]
  },
  {
    id: 18,
    name: "Converse Chuck Taylor All Star",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80",
    stores: [
      { name: "Converse", price: 60.00, currency: "$", url: "https://converse.com", rating: 4.6, reviews: 45678, shipping: "5 days", inStock: true },
      { name: "Amazon", price: 52.00, currency: "$", url: "https://amazon.com", rating: 4.5, reviews: 67890, shipping: "2 days", inStock: true },
      { name: "Foot Locker", price: 60.00, currency: "$", url: "https://footlocker.com", rating: 4.4, reviews: 34567, shipping: "3 days", inStock: true },
      { name: "Journeys", price: 60.00, currency: "$", url: "https://journeys.com", rating: 4.3, reviews: 12345, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 60 }, { date: 'Feb', price: 60 }, { date: 'Mar', price: 55 },
      { date: 'Apr', price: 52 }, { date: 'May', price: 52 }, { date: 'Jun', price: 52 }
    ]
  },

  // HOME (7 items)
  {
    id: 19,
    name: "Dyson V15 Detect Absolute Vacuum",
    category: "Home",
    image: "https://images.unsplash.com/photo-1558317374-a3545eca46f2?w=800&q=80",
    stores: [
      { name: "Dyson", price: 749.99, currency: "$", url: "https://dyson.com", rating: 4.8, reviews: 5432, shipping: "3 days", inStock: true },
      { name: "Best Buy", price: 699.99, currency: "$", url: "https://bestbuy.com", rating: 4.7, reviews: 3210, shipping: "2 days", inStock: true },
      { name: "Amazon", price: 679.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Home Depot", price: 729.99, currency: "$", url: "https://homedepot.com", rating: 4.5, reviews: 1234, shipping: "5 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 799 }, { date: 'Feb', price: 799 }, { date: 'Mar', price: 779 },
      { date: 'Apr', price: 749 }, { date: 'May', price: 699 }, { date: 'Jun', price: 679 }
    ]
  },
  {
    id: 20,
    name: "KitchenAid Artisan Stand Mixer",
    category: "Home",
    image: "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800&q=80",
    stores: [
      { name: "KitchenAid", price: 449.99, currency: "$", url: "https://kitchenaid.com", rating: 4.9, reviews: 23456, shipping: "5 days", inStock: true },
      { name: "Amazon", price: 399.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 45678, shipping: "2 days", inStock: true },
      { name: "Target", price: 449.99, currency: "$", url: "https://target.com", rating: 4.7, reviews: 12345, shipping: "3 days", inStock: true },
      { name: "Walmart", price: 429.00, currency: "$", url: "https://walmart.com", rating: 4.6, reviews: 9876, shipping: "2 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 449 }, { date: 'Feb', price: 449 }, { date: 'Mar', price: 429 },
      { date: 'Apr', price: 399 }, { date: 'May', price: 399 }, { date: 'Jun', price: 399 }
    ]
  },
  {
    id: 21,
    name: "Nespresso Vertuo Plus Coffee Maker",
    category: "Home",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
    stores: [
      { name: "Nespresso", price: 199.00, currency: "$", url: "https://nespresso.com", rating: 4.7, reviews: 12345, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 175.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 23456, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 189.99, currency: "$", url: "https://bestbuy.com", rating: 4.5, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Target", price: 199.99, currency: "$", url: "https://target.com", rating: 4.4, reviews: 5432, shipping: "3 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 199 }, { date: 'Feb', price: 199 }, { date: 'Mar', price: 189 },
      { date: 'Apr', price: 175 }, { date: 'May', price: 175 }, { date: 'Jun', price: 175 }
    ]
  },
  {
    id: 22,
    name: "Herman Miller Aeron Chair",
    category: "Home",
    image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80",
    stores: [
      { name: "Herman Miller", price: 1695.00, currency: "$", url: "https://hermanmiller.com", rating: 4.9, reviews: 8765, shipping: "2 weeks", inStock: true },
      { name: "Amazon", price: 1495.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 12345, shipping: "5 days", inStock: true },
      { name: "Office Depot", price: 1695.00, currency: "$", url: "https://officedepot.com", rating: 4.7, reviews: 5432, shipping: "1 week", inStock: true },
      { name: "Staples", price: 1595.00, currency: "$", url: "https://staples.com", rating: 4.6, reviews: 4321, shipping: "1 week", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 1695 }, { date: 'Feb', price: 1695 }, { date: 'Mar', price: 1595 },
      { date: 'Apr', price: 1495 }, { date: 'May', price: 1495 }, { date: 'Jun', price: 1495 }
    ]
  },
  {
    id: 23,
    name: "Instant Pot Duo Plus 9-in-1",
    category: "Home",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80",
    stores: [
      { name: "Instant Pot", price: 129.95, currency: "$", url: "https://instantpot.com", rating: 4.8, reviews: 45678, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 99.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 67890, shipping: "2 days", inStock: true },
      { name: "Walmart", price: 119.00, currency: "$", url: "https://walmart.com", rating: 4.6, reviews: 23456, shipping: "2 days", inStock: true },
      { name: "Target", price: 129.99, currency: "$", url: "https://target.com", rating: 4.5, reviews: 12345, shipping: "3 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 129 }, { date: 'Feb', price: 129 }, { date: 'Mar', price: 119 },
      { date: 'Apr', price: 99 }, { date: 'May', price: 99 }, { date: 'Jun', price: 99 }
    ]
  },
  {
    id: 24,
    name: "Philips Hue White & Color Starter Kit",
    category: "Home",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    stores: [
      { name: "Philips Hue", price: 199.99, currency: "$", url: "https://philips-hue.com", rating: 4.7, reviews: 12345, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 169.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 23456, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 189.99, currency: "$", url: "https://bestbuy.com", rating: 4.5, reviews: 8765, shipping: "2 days", inStock: true },
      { name: "Home Depot", price: 199.99, currency: "$", url: "https://homedepot.com", rating: 4.4, reviews: 5432, shipping: "3 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 199 }, { date: 'Feb', price: 199 }, { date: 'Mar', price: 189 },
      { date: 'Apr', price: 169 }, { date: 'May', price: 169 }, { date: 'Jun', price: 169 }
    ]
  },
  {
    id: 25,
    name: "Dyson Pure Cool TP07 Air Purifier",
    category: "Home",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
    stores: [
      { name: "Dyson", price: 649.99, currency: "$", url: "https://dyson.com", rating: 4.6, reviews: 8765, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 599.00, currency: "$", url: "https://amazon.com", rating: 4.5, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 649.99, currency: "$", url: "https://bestbuy.com", rating: 4.4, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "Target", price: 649.99, currency: "$", url: "https://target.com", rating: 4.3, reviews: 4321, shipping: "3 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 649 }, { date: 'Feb', price: 649 }, { date: 'Mar', price: 629 },
      { date: 'Apr', price: 599 }, { date: 'May', price: 599 }, { date: 'Jun', price: 599 }
    ]
  },

  // GAMING (5 items)
  {
    id: 26,
    name: "PlayStation 5 Console Disc Edition",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    stores: [
      { name: "Sony", price: 499.99, currency: "$", url: "https://playstation.com", rating: 4.9, reviews: 45678, shipping: "1 week", inStock: true },
      { name: "Best Buy", price: 499.99, currency: "$", url: "https://bestbuy.com", rating: 4.8, reviews: 23456, shipping: "3 days", inStock: false },
      { name: "Amazon", price: 549.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 67890, shipping: "2 days", inStock: true },
      { name: "GameStop", price: 499.99, currency: "$", url: "https://gamestop.com", rating: 4.6, reviews: 12345, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 499 }, { date: 'Feb', price: 499 }, { date: 'Mar', price: 499 },
      { date: 'Apr', price: 499 }, { date: 'May', price: 499 }, { date: 'Jun', price: 499 }
    ]
  },
  {
    id: 27,
    name: "Xbox Series X Console",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80",
    stores: [
      { name: "Microsoft", price: 499.99, currency: "$", url: "https://xbox.com", rating: 4.8, reviews: 34567, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 479.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 45678, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 499.99, currency: "$", url: "https://bestbuy.com", rating: 4.6, reviews: 23456, shipping: "3 days", inStock: true },
      { name: "Walmart", price: 499.99, currency: "$", url: "https://walmart.com", rating: 4.5, reviews: 18765, shipping: "2 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 499 }, { date: 'Feb', price: 499 }, { date: 'Mar', price: 489 },
      { date: 'Apr', price: 479 }, { date: 'May', price: 479 }, { date: 'Jun', price: 479 }
    ]
  },
  {
    id: 28,
    name: "Steam Deck OLED 512GB",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80",
    stores: [
      { name: "Steam", price: 549.00, currency: "$", url: "https://store.steampowered.com", rating: 4.9, reviews: 12345, shipping: "1 week", inStock: true },
      { name: "Amazon", price: 599.00, currency: "$", url: "https://amazon.com", rating: 4.7, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 549.99, currency: "$", url: "https://bestbuy.com", rating: 4.6, reviews: 4321, shipping: "3 days", inStock: false }
    ],
    priceHistory: [
      { date: 'Jan', price: 549 }, { date: 'Feb', price: 549 }, { date: 'Mar', price: 549 },
      { date: 'Apr', price: 549 }, { date: 'May', price: 549 }, { date: 'Jun', price: 549 }
    ]
  },
  {
    id: 29,
    name: "Razer BlackShark V2 Pro Headset",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1612444530582-fc66183b16f7?w=800&q=80",
    stores: [
      { name: "Razer", price: 179.99, currency: "$", url: "https://razer.com", rating: 4.7, reviews: 8765, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 149.00, currency: "$", url: "https://amazon.com", rating: 4.6, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 179.99, currency: "$", url: "https://bestbuy.com", rating: 4.5, reviews: 5678, shipping: "2 days", inStock: true },
      { name: "GameStop", price: 169.99, currency: "$", url: "https://gamestop.com", rating: 4.4, reviews: 3456, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 179 }, { date: 'Feb', price: 179 }, { date: 'Mar', price: 169 },
      { date: 'Apr', price: 149 }, { date: 'May', price: 149 }, { date: 'Jun', price: 149 }
    ]
  },
  {
    id: 30,
    name: "Elgato Stream Deck MK.2",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
    stores: [
      { name: "Elgato", price: 149.99, currency: "$", url: "https://elgato.com", rating: 4.9, reviews: 23456, shipping: "3 days", inStock: true },
      { name: "Amazon", price: 129.00, currency: "$", url: "https://amazon.com", rating: 4.8, reviews: 34567, shipping: "2 days", inStock: true },
      { name: "Best Buy", price: 149.99, currency: "$", url: "https://bestbuy.com", rating: 4.7, reviews: 12345, shipping: "2 days", inStock: true },
      { name: "B&H Photo", price: 139.00, currency: "$", url: "https://bhphotovideo.com", rating: 4.6, reviews: 8765, shipping: "5 days", inStock: true }
    ],
    priceHistory: [
      { date: 'Jan', price: 149 }, { date: 'Feb', price: 149 }, { date: 'Mar', price: 139 },
      { date: 'Apr', price: 129 }, { date: 'May', price: 129 }, { date: 'Jun', price: 129 }
    ]
  }
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'all'
  const sortBy = searchParams.get('sort') || 'relevance'
  
  let filtered = productsDB

  if (query) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
    )
  }

  if (category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

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
  } else if (sortBy === 'savings') {
    filtered = filtered.sort((a, b) => {
      const savingsA = Math.max(...a.stores.map(s => s.price)) - Math.min(...a.stores.map(s => s.price))
      const savingsB = Math.max(...b.stores.map(s => s.price)) - Math.min(...b.stores.map(s => s.price))
      return savingsB - savingsA
    })
  }

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
    query: query || null,
    timestamp: new Date().toISOString()
  })
}