import { Card } from '@/components/ui/card';
import { Video } from '../api/dashboard/page';

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <Card className="overflow-hidden bg-card border-border">
      <div className="aspect-video w-full bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground">{video.title}</h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {video.votes} votes
          </span>
        </div>
      </div>
    </Card>
  )
}
