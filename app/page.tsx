import { Suspense } from "react"
import NewsList from "@/components/news-list"
import { NewsListSkeleton } from "@/components/news-list-skeleton"
import { ModeToggle } from "@/components/mode-toggle"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-xl font-bold">Khanh Hoa Real Estate News</h1>
          <ModeToggle />
        </div>
      </header>
      <main className="container py-8">
        <div className="mb-8 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Latest News</h2>
          <p className="text-muted-foreground">
            Stay updated with the latest real estate developments in Khanh Hoa, Vietnam.
          </p>
        </div>
        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList />
        </Suspense>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Khanh Hoa Real Estate News. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

