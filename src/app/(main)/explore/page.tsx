import { Suspense } from 'react'
import { MapPin, List, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ExplorePage() {
  return (
    <div className="flex flex-col">
      {/* City Selector */}
      <div className="border-b bg-background p-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Select a city..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* View Toggle */}
          <div className="mt-4 flex gap-2">
            <Button variant="default" size="sm" className="flex-1">
              <MapPin className="mr-2 h-4 w-4" />
              Map
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <List className="mr-2 h-4 w-4" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Map/List View */}
      <div className="flex-1">
        <Suspense fallback={<LoadingSkeleton />}>
          <div className="flex h-[calc(100vh-12rem)] items-center justify-center bg-muted/30">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h2 className="mt-4 text-lg font-semibold">
                Select a city to explore
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Discover restaurants recommended by people you trust
              </p>
            </div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex h-[calc(100vh-12rem)] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  )
}
