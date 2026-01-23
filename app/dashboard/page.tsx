'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, Plus, Link as LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { refresh } from 'next/cache'
import axios from "axios";



// Types
export interface Video {
  id: string
  youtubeId: string
  title: string
  thumbnail: string
  votes: number
  userVote?: 'up' | 'down' | null
}

interface VideoPreview {
  youtubeId: string
  title: string
  thumbnail: string
}

const REFRESH_INTERVAL_MS = 10 * 1000;

export default function DashboardPage() {
  // Video state
  const [currentVideo, setCurrentVideo] = useState<Video>({
    id: '1',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Current Playing Song - Rick Astley - Never Gonna Give You Up',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    votes: 142,
  })

  const [queue, setQueue] = useState<Video[]>([
    {
      id: '2',
      youtubeId: 'kJQP7kiw5Fk',
      title: 'Luis Fonsi - Despacito ft. Daddy Yankee',
      thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      votes: 87,
    },
    {
      id: '3',
      youtubeId: '9bZkp7q19f0',
      title: 'PSY - GANGNAM STYLE',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      votes: 65,
    },
    {
      id: '4',
      youtubeId: 'OPf0YbXqDm0',
      title: 'Mark Ronson - Uptown Funk ft. Bruno Mars',
      thumbnail: 'https://img.youtube.com/vi/OPf0YbXqDm0/maxresdefault.jpg',
      votes: 54,
    },
    {
      id: '5',
      youtubeId: 'lDK9QqIzhwk',
      title: 'Levan Polkka - Loituma',
      thumbnail: 'https://img.youtube.com/vi/lDK9QqIzhwk/maxresdefault.jpg',
      votes: 41,
    },
  ])

  // Submission state
  const [url, setUrl] = useState('')
  const [preview, setPreview] = useState<VideoPreview | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


async function refreshStreams() {
  try {
    const res = await axios.get(`/api/streams/my`);
    console.log(res);
    // TODO: Update state with res.data
  } catch (error) {
    console.error("Failed to refresh streams:", error);
  }
}

useEffect(() => {
  refreshStreams(); 
  
  const interval = setInterval(() => {
    refreshStreams();
  }, REFRESH_INTERVAL_MS);

  return () => clearInterval(interval);
}, []);




  // Video voting handler
  const handleVote = (videoId: string, voteType: 'up' | 'down') => {
    setQueue((prevQueue) =>
      prevQueue
        .map((video) => {
          if (video.id !== videoId) return video

          const currentVote = video.userVote
          let newVotes = video.votes
          let newUserVote: 'up' | 'down' | null = voteType

          // If clicking the same vote, remove it
          if (currentVote === voteType) {
            newUserVote = null
            newVotes += voteType === 'up' ? -1 : 1
          }
          // If switching votes
          else if (currentVote) {
            newVotes += voteType === 'up' ? 2 : -2
          }
          // If voting for the first time
          else {
            newVotes += voteType === 'up' ? 1 : -1
          }

          return { ...video, votes: newVotes, userVote: newUserVote }
        })
        .sort((a, b) => b.votes - a.votes)
    )
  }

  // Extract YouTube ID from URL
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

  // Preview video before adding
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

  // Add video to queue
  const handleAddVideo = () => {
    if (preview) {
      const newVideo: Video = {
        id: Date.now().toString(),
        youtubeId: preview.youtubeId,
        title: preview.title,
        thumbnail: preview.thumbnail,
        votes: 0,
      }
      setQueue((prevQueue) => [...prevQueue, newVideo].sort((a, b) => b.votes - a.votes))
      setUrl('')
      setPreview(null)
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,60,200,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(60,100,200,0.08),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
              Stream <span className="text-[#615ED6]">Queue</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
              Vote for the next song to be played on the stream. Submit your favorite tracks and let the community decide!
            </p>
          </div>

          {/* Video Submission Section */}
          <Card className="p-6 bg-card border-border mb-16">
            <h3 className="text-xl font-semibold mb-4">Submit a Song</h3>
            
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
                  className="bg-[#615ED6] text-white hover:bg-[#615ED6]/90"
                >
                  Preview
                </Button>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {preview && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                    <img
                      src={preview.thumbnail}
                      alt={preview.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{preview.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ready to add to queue
                      </p>
                    </div>
                    <Button
                      onClick={handleAddVideo}
                      className="bg-[#615ED6] text-white hover:bg-[#615ED6]/90 shrink-0"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Queue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Currently Playing Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#615ED6] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#615ED6]" />
              </span>
              Now Playing
            </h2>
            <Card className="overflow-hidden bg-card border-border">
              <div className="aspect-video w-full bg-black">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=1`}
                  title={currentVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">{currentVideo.title}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {currentVideo.votes} votes
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Queue Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Up Next <span className="text-muted-foreground text-lg ml-2">({queue.length} songs)</span>
            </h2>
            
            {queue.length === 0 ? (
              <Card className="p-12 text-center bg-card border-border">
                <p className="text-muted-foreground">No songs in queue yet. Be the first to add one!</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {queue.map((video, index) => (
                  <Card
                    key={video.id}
                    className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 p-4">
                      {/* Position Badge */}
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-[#615ED6] text-white flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>

                      {/* Thumbnail */}
                      <div className="shrink-0 w-32 h-20 rounded-md overflow-hidden bg-black">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">
                          {video.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {video.votes} {video.votes === 1 ? 'vote' : 'votes'}
                        </p>
                      </div>

                      {/* Vote Buttons */}
                      <div className="shrink-0 flex flex-col items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(video.id, 'up')}
                          className={cn(
                            'h-8 w-8 p-0 hover:bg-primary/20',
                            video.userVote === 'up' && 'text-[#615ED6]'
                          )}
                        >
                          <ChevronUp className="h-5 w-5" />
                        </Button>
                        <span
                          className={cn(
                            'text-lg font-bold min-w-[2rem] text-center',
                            video.votes > 0 && 'text-[#615ED6]'
                          )}
                        >
                          {video.votes}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(video.id, 'down')}
                          className={cn(
                            'h-8 w-8 p-0 hover:bg-destructive/20',
                            video.userVote === 'down' && 'text-destructive'
                          )}
                        >
                          <ChevronDown className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}