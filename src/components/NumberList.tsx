'use client'

import { useEffect, useState } from 'react'

interface RandomNumber {
  id: number
  value: number
  createdAt: string
  updatedAt: string
}

export default function NumberList() {
  const [numbers, setNumbers] = useState<RandomNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNumbers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/numbers')
      if (!response.ok) {
        throw new Error('Failed to fetch numbers')
      }
      const data = await response.json()
      setNumbers(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNumbers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading numbers...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-800">Error: {error}</p>
        <button
          onClick={fetchNumbers}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Random Numbers</h2>
        <button
          onClick={fetchNumbers}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>
      
      {numbers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No numbers yet. Generate your first random number!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {numbers.map((number) => (
            <div
              key={number.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {number.value}
                </div>
                <div className="text-sm text-gray-500">
                  Generated: {new Date(number.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
