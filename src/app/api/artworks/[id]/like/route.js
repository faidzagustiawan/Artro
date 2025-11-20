import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

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

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('artwork_id', artworkId)
      .single()

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 400 }
      )
    }

    // Insert like
    const { data, error } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        artwork_id: artworkId
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

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

    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('artwork_id', artworkId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}