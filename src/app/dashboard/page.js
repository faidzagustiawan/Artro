import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/helpers'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import DashboardArtwork from '@/components/DashboardArtwork'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  // Strict check: must be logged in AND be an artist
  if (!user) {
    redirect('/login?redirectTo=/dashboard')
  }
  
  if (user.role !== 'artist') {
    redirect('/forbidden')
  }

  const supabase = await createClient()

  // Fetch artist's artworks with likes and comments
  const { data: artworks } = await supabase
    .from('artworks')
    .select(`
      *,
      likes:likes(
        id,
        user_id,
        users:user_id (
          id,
          name,
          avatar_url
        )
      ),
      comments:comments(
        id,
        comment_text,
        created_at,
        user_id,
        users:user_id (
          id,
          name,
          avatar_url
        )
      )
    `)
    .eq('artist_id', user.id)
    .order('created_at', { ascending: false })

  // Get notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select(`
      *,
      users:from_user_id (
        id,
        name,
        avatar_url
      ),
      artworks (
        id,
        title
      )
    `)
    .eq('artist_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Calculate stats
  const totalArtworks = artworks?.length || 0
  const totalLikes = artworks?.reduce((sum, art) => sum + (art.likes?.length || 0), 0) || 0
  const totalComments = artworks?.reduce((sum, art) => sum + (art.comments?.length || 0), 0) || 0

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
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
            <Link href="/upload" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Upload
            </Link>
            <span className="text-gray-700">Hi, {user.name}</span>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your artworks and see engagement</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-2xl font-bold text-gray-900">{totalArtworks}</div>
            <div className="text-gray-600">Total Artworks</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-gray-900">{totalLikes}</div>
            <div className="text-gray-600">Total Likes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-gray-900">{totalComments}</div>
            <div className="text-gray-600">Total Comments</div>
          </div>
        </div>

        {/* Recent Notifications */}
        {notifications && notifications.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notif) => (
                <div key={notif.id} className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                    {notif.users?.avatar_url ? (
                      <img 
                        src={notif.users.avatar_url} 
                        alt={notif.users.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs">{notif.users?.name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold">{notif.users?.name}</span>
                    <span className="text-gray-600">
                      {notif.type === 'like' ? ' liked' : ' commented on'} your artwork
                    </span>
                    <Link href={`/artwork/${notif.artwork_id}`} className="text-blue-600 hover:underline">
                      {' "' + notif.artworks?.title + '"'}
                    </Link>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Artworks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Artworks</h2>
            <Link 
              href="/upload"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Upload New
            </Link>
          </div>

          {artworks && artworks.length > 0 ? (
            <div className="space-y-6">
              {artworks.map((artwork) => (
                <DashboardArtwork key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't uploaded any artworks yet</p>
              <Link 
                href="/upload"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload Your First Artwork
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}