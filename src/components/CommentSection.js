'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CommentSection({ artworkId, userId, isAuthenticated }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchComments()
  }, [artworkId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/artworks/${artworkId}/comments`)
      const data = await response.json()
      setComments(data.data || [])
    } catch (error) {
      console.error('Fetch comments error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=/artwork/${artworkId}`)
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/artworks/${artworkId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment_text: newComment }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error)
      }

      const data = await response.json()
      setComments([data.data, ...comments])
      setNewComment('')
      router.refresh()
    } catch (error) {
      console.error('Comment error:', error)
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={isAuthenticated ? "Write a comment..." : "Please login to comment"}
          disabled={!isAuthenticated || submitting}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={!isAuthenticated || submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                  {comment.users?.avatar_url ? (
                    <img 
                      src={comment.users.avatar_url} 
                      alt={comment.users.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{comment.users?.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {comment.users?.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.comment_text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}