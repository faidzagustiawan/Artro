import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request, { params }) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const artworkId = params.id

    // Verify ownership
    const { data: artwork } = await supabase
      .from('artworks')
      .select('artist_id')
      .eq('id', artworkId)
      .single()

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    if (artwork.artist_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own artworks' },
        { status: 403 }
      )
    }

    // Delete artwork (CASCADE will delete related likes, comments, notifications)
    const { error } = await supabase
      .from('artworks')
      .delete()
      .eq('id', artworkId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete artwork error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}