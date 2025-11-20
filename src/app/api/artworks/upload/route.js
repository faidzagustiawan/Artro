import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Check if user is authenticated
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      )
    }

    // Verify user is an artist with strict check
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (userData.role !== 'artist') {
      return NextResponse.json(
        { error: 'Forbidden - Only artists can upload artworks' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const title = formData.get('title')
    const description = formData.get('description')
    const category = formData.get('category')
    const media_type = formData.get('media_type')

    // Validate required fields
    if (!file || !title || !category || !media_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['fairy', 'kastil', 'fiksi', 'alam', 'mitologi']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Validate media_type
    const validMediaTypes = ['image', 'video', 'audio', 'text']
    if (!validMediaTypes.includes(media_type)) {
      return NextResponse.json(
        { error: 'Invalid media type' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'artworks',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    // Insert artwork into database
    const { data: artwork, error: dbError } = await supabase
      .from('artworks')
      .insert({
        title,
        description,
        artist_id: user.id,
        category,
        media_type,
        media_url: uploadResponse.secure_url,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({ 
      success: true, 
      data: artwork 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}