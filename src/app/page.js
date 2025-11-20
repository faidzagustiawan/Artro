import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/helpers'

export default async function HomePage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-8">
          <h2 className="text-5xl font-bold text-gray-900">
            Discover Amazing Artworks
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore a curated collection of fairy tales, castles, fiction, nature, and mythology from talented artists around the world.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/gallery"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              Browse Gallery
            </Link>
            {!user && (
              <Link 
                href="/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-medium border-2 border-blue-600 hover:bg-blue-50"
              >
                Join as Artist
              </Link>
            )}
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-5 gap-6">
          {['fairy', 'kastil', 'fiksi', 'alam', 'mitologi'].map((category) => (
            <Link
              key={category}
              href={`/gallery?category=${category}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-2">🎨</div>
              <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
            </Link>
          ))}
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold mb-2">Discover</h3>
            <p className="text-gray-600">Browse through diverse categories of stunning artworks</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-2">Appreciate</h3>
            <p className="text-gray-600">Like and comment on your favorite pieces</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Create</h3>
            <p className="text-gray-600">Share your own artwork with the community</p>
          </div>
        </div>
      </main>
    </div>
  )
}