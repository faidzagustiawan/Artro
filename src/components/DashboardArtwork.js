'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DashboardArtwork({ artwork }) {
  const [showDetails, setShowDetails] = useState(false)

  const likes = artwork.likes || []
  const comments = artwork.comments || []

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Artwork Header */}
      <div className="p-4 bg-gray-50 flex items-center gap-4">
        <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
          {artwork.media_type === 'image' ? (
            <img
              src={artwork.media_url}
              alt={artwork.title}
              className="w-full h-full object-cover"
            />
          ) : artwork.media_type === 'video' ? (
            <video
              src={artwork.media_url}
              className="w-full h-full object-cover"
              muted
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-2xl">
                {artwork.media_type === 'audio' ? '🎵' : '📄'}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{artwork.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span className="capitalize">{artwork.category}</span>
            <span>❤️ {likes.length}</span>
            <span>💬 {comments.length}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/artwork/${artwork.id}`}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            View
          </Link>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="p-4 space-y-4">
          {/* Likes Section */}
          {likes.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Likes ({likes.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {likes.map((like) => (
                  <div key={like.id} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      {like.users?.avatar_url ? (
                        <img 
                          src={like.users.avatar_url} 
                          alt={like.users.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs">{like.users?.name?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-gray-700">{like.users?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          {comments.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-semibold text-gray-900 mb-3">
                Comments ({comments.length})
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                        {comment.users?.avatar_url ? (
                          <img 
                            src={comment.users.avatar_url} 
                            alt={comment.users.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs">{comment.users?.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <span className="font-semibold text-sm">{comment.users?.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 ml-8">{comment.comment_text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {likes.length === 0 && comments.length === 0 && (
            <p className="text-center text-gray-500 py-4">
              No engagement yet. Share your artwork to get likes and comments!
            </p>
          )}
        </div>
      )}
    </div>
  )
}