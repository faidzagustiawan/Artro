import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET comments for an artwork
export async function GET(request, { params }) {
  try {
    const supabase = await createClient()
    const artworkId = params.id

    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .eq('artwork_id', artworkId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST new comment
export async function POST(request, { params }) {
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
    const body = await request.json()
    const { comment_text } = body

    if (!comment_text || comment_text.trim() === '') {
      return NextResponse.json(
        { error: 'Comment text is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        artwork_id: artworkId,
        comment_text: comment_text.trim()
      })
      .select(`
        *,
        users:user_id (
          id,
          name,
          avatar_url
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Post comment error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}