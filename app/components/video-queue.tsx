'use client';

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Video } from '../api/dashboard/page';
import { cn } from '@/lib/utils'

interface VideoQueueProps {
  queue: Video[]
  onVote: (videoId: string, voteType: 'up' | 'down') => void
}

export function VideoQueue({ queue, onVote }: VideoQueueProps) {
  if (queue.length === 0) {
    return (
      <Card className="p-12 text-center bg-card border-border">
        <p className="text-muted-foreground">{'No songs in queue yet. Be the first to add one!'}</p>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {queue.map((video, index) => (
        <Card
          key={video.id}
          className="overflow-hidden bg-card border-border hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-4 p-4">
            {/* Position Badge */}
            <div
              className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: '#615ED6', color: 'white' }}
            >
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="shrink-0 w-32 h-20 rounded-md overflow-hidden bg-black">
              <img
                src={video.thumbnail || "/placeholder.svg"}
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
                onClick={() => onVote(video.id, 'up')}
                className={cn(
                  'h-8 w-8 p-0 hover:bg-primary/20',
                  video.userVote === 'up' && 'text-primary'
                )}
                style={video.userVote === 'up' ? { color: '#615ED6' } : {}}
              >
                <ChevronUp className="h-5 w-5" />
              </Button>
              <span
                className="text-lg font-bold min-w-[2rem] text-center"
                style={video.votes > 0 ? { color: '#615ED6' } : {}}
              >
                {video.votes}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onVote(video.id, 'down')}
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
  )
}
