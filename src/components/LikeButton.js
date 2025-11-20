'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LikeButton({ artworkId, initialLiked, initialCount, isAuthenticated }) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=/artwork/${artworkId}`)
      return
    }

    setLoading(true)

    try {
      const method = liked ? 'DELETE' : 'POST'
      const response = await fetch(`/api/artworks/${artworkId}/like`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      // Toggle like state
      setLiked(!liked)
      setCount(liked ? count - 1 : count + 1)
      
      // Refresh to update server data
      router.refresh()
    } catch (error) {
      console.error('Like error:', error)
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
        liked
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      <span className="text-xl">{liked ? '❤️' : '🤍'}</span>
      <span>{count} {count === 1 ? 'Like' : 'Likes'}</span>
    </button>
  )
}