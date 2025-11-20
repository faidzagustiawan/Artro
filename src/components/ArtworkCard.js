import Link from 'next/link'
import Image from 'next/image'

export default function ArtworkCard({ artwork, userId }) {
  const likesCount = artwork.likes?.[0]?.count || 0
  const commentsCount = artwork.comments?.[0]?.count || 0

  return (
    <Link href={`/artwork/${artwork.id}`}>
      <div className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden cursor-pointer">
        {/* Image */}
        <div className="relative h-64 bg-gray-200">
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
              <span className="text-6xl">
                {artwork.media_type === 'audio' ? '🎵' : '📄'}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">
            {artwork.title}
          </h3>
          
          {artwork.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {artwork.description}
            </p>
          )}

          {/* Artist Info */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
              {artwork.users?.avatar_url ? (
                <img 
                  src={artwork.users.avatar_url} 
                  alt={artwork.users.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{artwork.users?.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <span className="text-sm text-gray-600">{artwork.users?.name}</span>
          </div>

          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded capitalize">
              {artwork.category}
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <span>❤️</span>
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>💬</span>
              <span>{commentsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}