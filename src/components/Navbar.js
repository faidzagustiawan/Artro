import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/helpers'
import LogoutButton from '@/components/LogoutButton'

export default async function Navbar() {
  const user = await getCurrentUser()

  return (
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
              <LogoutButton />
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
  )
}