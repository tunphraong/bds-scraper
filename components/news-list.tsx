import { useState } from "react"
import { NewsCard } from "@/components/news-card"
import { scrapeRealEstateNews } from "@/lib/scraper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

export default async function NewsList() {
  const newsBySource = await scrapeRealEstateNews()

  if (Object.keys(newsBySource).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium">No news found</h3>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue={Object.keys(newsBySource)[0]} className="w-full">
        <TabsList className="mb-4 flex w-full overflow-x-auto">
          {Object.keys(newsBySource).map((source) => (
            <TabsTrigger key={source} value={source} className="flex-shrink-0">
              {source} ({newsBySource[source].length})
            </TabsTrigger>
          ))}
        </TabsList>
        
        {Object.entries(newsBySource).map(([source, news]) => (
          <TabsContent key={source} value={source} className="space-y-4">
            <h3 className="text-2xl font-bold tracking-tight">{source}</h3>
            <ScrollArea className="h-[800px] pr-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {news.map((item, index) => (
                  <NewsCard key={index} news={item} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
