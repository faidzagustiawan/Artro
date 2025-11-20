import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Get current user with their role
 * Use in Server Components
 */
export async function getCurrentUser() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return userData
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Check if user is an artist
 */
export async function isArtist() {
  const user = await getCurrentUser()
  return user?.role === 'artist'
}

/**
 * Check if user is admin
 */
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

/**
 * Verify if current user owns the artwork
 */
export async function canManageArtwork(artworkId) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'artist') return false

  const supabase = await createServerClient()
  const { data: artwork } = await supabase
    .from('artworks')
    .select('artist_id')
    .eq('id', artworkId)
    .single()

  return artwork?.artist_id === user.id
}