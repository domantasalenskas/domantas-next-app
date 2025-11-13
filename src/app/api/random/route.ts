import { NextResponse } from 'next/server'

// GET /api/random - Returns hardcoded test data
export async function GET() {
  // Hardcoded test data
  const testData = {
    users: [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
    ],
    products: [
      { id: 101, name: 'Laptop', price: 999.99, inStock: true },
      { id: 102, name: 'Mouse', price: 29.99, inStock: true },
      { id: 103, name: 'Keyboard', price: 79.99, inStock: false }
    ],
    stats: {
      totalUsers: 150,
      totalOrders: 423,
      revenue: 45678.90,
      lastUpdated: '2025-11-13T10:30:00Z'
    },
    message: 'This is hardcoded test data for testing purposes',
    timestamp: new Date().toISOString()
  }

  return NextResponse.json(testData)
}

