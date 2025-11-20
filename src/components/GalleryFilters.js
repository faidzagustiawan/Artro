'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'fairy', label: 'Fairy' },
  { value: 'kastil', label: 'Kastil' },
  { value: 'fiksi', label: 'Fiksi' },
  { value: 'alam', label: 'Alam' },
  { value: 'mitologi', label: 'Mitologi' }
]

export default function GalleryFilters({ currentCategory, currentSearch }) {
  const [search, setSearch] = useState(currentSearch || '')
  const router = useRouter()

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search) params.set('search', search)
    
    router.push(`/gallery?${params.toString()}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (currentCategory) params.set('category', currentCategory)
    if (search) params.set('search', search)
    
    router.push(`/gallery?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/gallery')
  }

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search artworks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Clear Filters */}
        {(currentCategory || currentSearch) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              currentCategory === cat.value || (!currentCategory && cat.value === '')
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}