import Image from "next/image"
import { Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NewsItem } from "@/lib/types"

interface NewsCardProps {
  news: NewsItem
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={news.imageUrl || `/placeholder.svg?height=192&width=384`}
          alt={news.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {news.category && (
              <Badge variant="secondary" className="px-2 py-0 text-xs">
                {news.category}
              </Badge>
            )}
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {news.date}
            </div>
          </div>
          <h3 className="line-clamp-2 font-semibold leading-tight">{news.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="line-clamp-3 text-sm text-muted-foreground">{news.summary}</p>
        {news.location && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            {news.location}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" size="sm">
          <a href={news.url} target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

