'use client'

import { useState } from 'react'

interface NumberGeneratorProps {
  onNumberGenerated: () => void
}

export default function NumberGenerator({ onNumberGenerated }: NumberGeneratorProps) {
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(100)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const generateNumber = async () => {
    if (min >= max) {
      setError('Minimum value must be less than maximum value')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ min, max }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate number')
      }

      const newNumber = await response.json()
      setSuccess(`Generated number: ${newNumber.value}`)
      onNumberGenerated() // Refresh the number list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Random Number</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="min" className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Value
            </label>
            <input
              id="min"
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
          
          <div>
            <label htmlFor="max" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Value
            </label>
            <input
              id="max"
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 100)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="2"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">{success}</p>
          </div>
        )}

        <button
          onClick={generateNumber}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating...
            </div>
          ) : (
            'Generate Random Number'
          )}
        </button>

        <div className="text-sm text-gray-500 text-center">
          Will generate a number between {min} and {max} (inclusive)
        </div>
      </div>
    </div>
  )
}
