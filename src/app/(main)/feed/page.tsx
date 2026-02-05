import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/feed')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Your Feed</h1>
      <p className="mt-2 text-muted-foreground">
        See the latest recommendations from people you follow
      </p>

      {/* Empty State */}
      <div className="mt-12 flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-lg font-semibold">Your feed is empty</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Follow food lovers to see their recommendations in your feed. Discover
          people whose taste you trust.
        </p>
        <Link href="/explore" className="mt-6">
          <Button>Find People to Follow</Button>
        </Link>
      </div>
    </div>
  )
}
