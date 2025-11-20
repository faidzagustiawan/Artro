'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'fairy',
    media_type: 'image'
  })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const supabase = createClient()

  // Verify user is an artist on client side too
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login?redirectTo=/upload')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'artist') {
        router.push('/forbidden')
        return
      }

      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setPreview(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)

    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      uploadData.append('title', formData.title)
      uploadData.append('description', formData.description)
      uploadData.append('category', formData.category)
      uploadData.append('media_type', formData.media_type)

      const response = await fetch('/api/artworks/upload', {
        method: 'POST',
        body: uploadData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      const result = await response.json()
      router.push(`/artwork/${result.data.id}`)
      router.refresh()
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 border-b bg-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            ArtGallery
          </Link>
          <nav className="flex gap-4">
            <Link href="/gallery" className="text-gray-700 hover:text-gray-900">
              Gallery
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Artwork</h1>
          <p className="text-gray-600">Share your creative work with the community</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter artwork title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your artwork..."
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fairy">Fairy</option>
                <option value="kastil">Kastil</option>
                <option value="fiksi">Fiksi</option>
                <option value="alam">Alam</option>
                <option value="mitologi">Mitologi</option>
              </select>
            </div>

            {/* Media Type */}
            <div>
              <label htmlFor="media_type" className="block text-sm font-medium text-gray-700 mb-2">
                Media Type *
              </label>
              <select
                id="media_type"
                name="media_type"
                required
                value={formData.media_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="text">Text</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <input
                type="file"
                id="file"
                required
                onChange={handleFileChange}
                accept={
                  formData.media_type === 'image' ? 'image/*' :
                  formData.media_type === 'video' ? 'video/*' :
                  formData.media_type === 'audio' ? 'audio/*' :
                  '*'
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.media_type === 'image' && 'Accepted formats: JPG, PNG, GIF, WebP'}
                {formData.media_type === 'video' && 'Accepted formats: MP4, WebM, MOV'}
                {formData.media_type === 'audio' && 'Accepted formats: MP3, WAV, OGG'}
                {formData.media_type === 'text' && 'Accepted formats: TXT, PDF, DOC'}
              </p>
            </div>

            {/* Preview */}
            {preview && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain bg-gray-100"
                  />
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {uploading ? 'Uploading...' : 'Upload Artwork'}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}