import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/numbers - Fetch all random numbers
export async function GET() {
  try {
    const numbers = await prisma.randomNumber.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(numbers)
  } catch (error) {
    console.error('Error fetching numbers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch numbers' },
      { status: 500 }
    )
  }
}

// POST /api/numbers - Add a new random number
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { min = 1, max = 100 } = body
    
    // Generate random number between min and max
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min
    
    const newNumber = await prisma.randomNumber.create({
      data: {
        value: randomValue
      }
    })
    
    return NextResponse.json(newNumber, { status: 201 })
  } catch (error) {
    console.error('Error creating number:', error)
    return NextResponse.json(
      { error: 'Failed to create number' },
      { status: 500 }
    )
  }
}
