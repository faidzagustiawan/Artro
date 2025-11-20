import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/helpers'
import Link from 'next/link'
import ArtworkCard from '@/components/ArtworkCard'
import GalleryFilters from '@/components/GalleryFilters'

export default async function GalleryPage({ searchParams }) {
  const supabase = await createClient()
  const user = await getCurrentUser()
  
  const params = await searchParams
  const category = params?.category
  const search = params?.search

  // Build query
  let query = supabase
    .from('artworks')
    .select(`
      *,
      users:artist_id (
        id,
        name,
        avatar_url
      ),
      likes:likes(count),
      comments:comments(count)
    `)
    .order('created_at', { ascending: false })

  // Apply filters
  if (category) {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data: artworks, error } = await query

  if (error) {
    console.error('Error fetching artworks:', error)
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Art Gallery</h1>
          <p className="text-gray-600">
            {category ? `Showing ${category} artworks` : 'Explore all artworks'}
          </p>
        </div>

        {/* Filters */}
        <GalleryFilters currentCategory={category} currentSearch={search} />

        {/* Artworks Grid */}
        {artworks && artworks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {artworks.map((artwork) => (
              <ArtworkCard 
                key={artwork.id} 
                artwork={artwork}
                userId={user?.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No artworks found</p>
          </div>
        )}
      </main>
    </div>
  )
}