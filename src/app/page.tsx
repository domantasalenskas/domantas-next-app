'use client'

import { useState } from 'react'
import NumberGenerator from '@/components/NumberGenerator'
import NumberList from '@/components/NumberList'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleNumberGenerated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Random Number Generator
          </h1>
          <p className="text-gray-600">
            Generate random numbers and store them in the database
          </p>
        </header>

        <div className="max-w-4xl mx-auto space-y-8">
          <NumberGenerator onNumberGenerated={handleNumberGenerated} />
          <NumberList key={refreshKey} />
        </div>
      </div>
    </div>
  )
}
