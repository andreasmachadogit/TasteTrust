import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function SavedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/saved')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Saved Restaurants</h1>
      <p className="mt-2 text-muted-foreground">
        Your personal list of restaurants to visit
      </p>

      {/* Empty State */}
      <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Bookmark className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold">No saved restaurants yet</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Save restaurants you want to visit later. Build your personal wishlist
          of places to try.
        </p>
        <Link href="/explore" className="mt-6">
          <Button>Explore Restaurants</Button>
        </Link>
      </div>
    </div>
  )
}
