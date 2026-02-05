import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/lib/utils'
import { MapPin, Calendar, Users } from 'lucide-react'

interface ProfilePageProps {
  params: { username: string }
}

async function getUser(username: string) {
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          recommendations: true,
        },
      },
    },
  })

  return user
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions)
  const user = await getUser(params.username)

  if (!user) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === user.id

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
          <AvatarImage src={user.avatarUrl || undefined} alt={user.displayName || ''} />
          <AvatarFallback className="text-2xl">
            {getInitials(user.displayName || user.username || 'U')}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-muted-foreground">@{user.username}</p>

          {user.bio && <p className="mt-4">{user.bio}</p>}

          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-6 flex items-center justify-center gap-8 sm:justify-start">
            <div className="text-center">
              <p className="text-2xl font-bold">{user._count.recommendations}</p>
              <p className="text-sm text-muted-foreground">Reviews</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user._count.followers}</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{user._count.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {isOwnProfile ? (
            <Button variant="outline">Edit Profile</Button>
          ) : session ? (
            <Button>Follow</Button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 border-b">
        <nav className="-mb-px flex gap-8">
          <button className="border-b-2 border-primary pb-4 text-sm font-medium text-primary">
            Recommendations
          </button>
          <button className="pb-4 text-sm font-medium text-muted-foreground hover:text-foreground">
            Saved
          </button>
          <button className="pb-4 text-sm font-medium text-muted-foreground hover:text-foreground">
            About
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-8">
        {user._count.recommendations === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
            <h2 className="mt-4 text-lg font-semibold">No recommendations yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {isOwnProfile
                ? "You haven't shared any recommendations yet. Start by adding your favourite restaurants!"
                : `${user.displayName} hasn't shared any recommendations yet.`}
            </p>
            {isOwnProfile && (
              <Button className="mt-6" asChild>
                <a href="/add">Add Recommendation</a>
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Recommendations will be displayed here
          </div>
        )}
      </div>
    </div>
  )
}
