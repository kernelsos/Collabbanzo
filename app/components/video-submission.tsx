'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Link as LinkIcon } from 'lucide-react'


interface VideoSubmissionProps {
  onAddVideo: (youtubeId: string, title: string, thumbnail: string) => void
}

export function VideoSubmission({ onAddVideo }: VideoSubmissionProps) {
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<{
    youtubeId: string
    title: string
    thumbnail: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const extractYoutubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handlePreview = async () => {
    setError('')
    const youtubeId = extractYoutubeId(url)

    if (!youtubeId) {
      setError('Invalid YouTube URL. Please enter a valid link.')
      setPreview(null)
      return
    }

    setIsLoading(true)

    try {
      // Fetch video info from YouTube oEmbed API
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch video info')
      }

      const data = await response.json()

      setPreview({
        youtubeId,
        title: data.title,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
      })
    } catch (err) {
      setError('Could not load video preview. Please check the URL.')
      setPreview(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = () => {
    if (preview) {
      onAddVideo(preview.youtubeId, preview.title, preview.thumbnail)
      setUrl('')
      setPreview(null)
      setError('')
    }
  }

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-xl font-semibold mb-4">{'Submit a Song'}</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Paste YouTube link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePreview()}
              className="pl-10 bg-input border-border text-foreground"
            />
          </div>
          <Button
            onClick={handlePreview}
            disabled={!url || isLoading}
            style={{ backgroundColor: '#615ED6' }}
            className="text-white hover:opacity-90 transition-opacity"
          >
            {'Preview'}
          </Button>
        </div>

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {preview && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              <img
                src={preview.thumbnail || "/placeholder.svg"}
                alt={preview.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-medium text-foreground">{preview.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {'Ready to add to queue'}
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                style={{ backgroundColor: '#615ED6' }}
                className="text-white hover:opacity-90 transition-opacity shrink-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                {'Add to Queue'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
