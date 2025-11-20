import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/helpers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import LikeButton from '@/components/LikeButton'
import CommentSection from '@/components/CommentSection'

export default async function ArtworkDetailPage({ params }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  const { id } = await params

  // Fetch artwork with artist info
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select(`
      *,
      users:artist_id (
        id,
        name,
        avatar_url
      )
    `)
    .eq('id', id)
    .single()

  if (error || !artwork) {
    notFound()
  }

  // Get likes count
  const { count: likesCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('artwork_id', id)

  // Check if current user has liked
  let userHasLiked = false
  if (user) {
    const { data: likeData } = await supabase
      .from('likes')
      .select('id')
      .eq('artwork_id', id)
      .eq('user_id', user.id)
      .single()
    
    userHasLiked = !!likeData
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ArtGallery
          </Link>
          <nav className="flex gap-4 items-center">
            <Link href="/gallery" className="text-gray-700 hover:text-gray-900">
              Gallery
            </Link>
            {user ? (
              <>
                {user.role === 'artist' && (
                  <>
                    <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                      Dashboard
                    </Link>
                    <Link href="/upload" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Upload
                    </Link>
                  </>
                )}
                <span className="text-gray-700">Hi, {user.name}</span>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link 
          href="/gallery"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← Back to Gallery
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Media Section */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {artwork.media_type === 'image' ? (
              <img
                src={artwork.media_url}
                alt={artwork.title}
                className="w-full h-auto"
              />
            ) : artwork.media_type === 'video' ? (
              <video
                src={artwork.media_url}
                controls
                className="w-full h-auto"
              />
            ) : artwork.media_type === 'audio' ? (
              <div className="p-20 flex flex-col items-center justify-center bg-gray-100">
                <span className="text-8xl mb-4">🎵</span>
                <audio src={artwork.media_url} controls className="w-full" />
              </div>
            ) : (
              <div className="p-20 flex items-center justify-center bg-gray-100">
                <span className="text-8xl">📄</span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {artwork.title}
              </h1>
              <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded capitalize">
                {artwork.category}
              </span>
            </div>

            {/* Artist Info */}
            <div className="flex items-center gap-3 pb-6 border-b">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                {artwork.users?.avatar_url ? (
                  <img 
                    src={artwork.users.avatar_url} 
                    alt={artwork.users.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xl">{artwork.users?.name?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-semibold text-gray-900">{artwork.users?.name}</p>
              </div>
            </div>

            {/* Description */}
            {artwork.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{artwork.description}</p>
              </div>
            )}

            {/* Like Button */}
            <div className="pt-6 border-t">
              <LikeButton 
                artworkId={artwork.id}
                initialLiked={userHasLiked}
                initialCount={likesCount || 0}
                isAuthenticated={!!user}
              />
            </div>

            {/* Metadata */}
            <div className="text-sm text-gray-500">
              <p>Uploaded on {new Date(artwork.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection 
            artworkId={artwork.id}
            userId={user?.id}
            isAuthenticated={!!user}
          />
        </div>
      </main>
    </div>
  )
}