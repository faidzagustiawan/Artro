import Link from 'next/link'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
        <p className="text-gray-600 mb-2">You don't have permission to access this page.</p>
        <p className="text-gray-600 mb-8">This page is only accessible to artists.</p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/gallery"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Gallery
          </Link>
          <Link 
            href="/signup"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Sign Up as Artist
          </Link>
        </div>
      </div>
    </div>
  )
}