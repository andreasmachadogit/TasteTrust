import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { MapPin, Star, Clock, ExternalLink, Bookmark, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPriceRangeSymbol } from '@/lib/utils'

interface RestaurantPageProps {
  params: { id: string }
}

async function getRestaurant(id: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      recommendations: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          dishRecommendations: {
            include: {
              dish: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      dishes: {
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          recommendations: true,
          dishes: true,
        },
      },
    },
  })

  return restaurant
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await getRestaurant(params.id)

  if (!restaurant) {
    notFound()
  }

  const averageRating =
    restaurant.recommendations.length > 0
      ? restaurant.recommendations.reduce((sum, r) => sum + r.rating, 0) /
        restaurant.recommendations.length
      : 0

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 md:h-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-16 w-16 text-primary/30" />
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="container mx-auto max-w-4xl px-4">
        <div className="-mt-12 rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                </span>
                <span>·</span>
                <span>{restaurant.cuisineType}</span>
                <span>·</span>
                <span>{getPriceRangeSymbol(restaurant.priceRange)}</span>
                <span>·</span>
                <span>{restaurant._count.recommendations} reviews</span>
              </div>
              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {restaurant.address}, {restaurant.city}, {restaurant.country}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button>Add Review</Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-b">
          <nav className="-mb-px flex gap-8">
            <button className="border-b-2 border-primary pb-4 text-sm font-medium text-primary">
              Reviews ({restaurant._count.recommendations})
            </button>
            <button className="pb-4 text-sm font-medium text-muted-foreground hover:text-foreground">
              Dishes ({restaurant._count.dishes})
            </button>
            <button className="pb-4 text-sm font-medium text-muted-foreground hover:text-foreground">
              Info
            </button>
          </nav>
        </div>

        {/* Reviews */}
        <div className="mt-8 space-y-6">
          {restaurant.recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Star className="h-12 w-12 text-muted-foreground/50" />
              <h2 className="mt-4 text-lg font-semibold">No reviews yet</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Be the first to share your experience at {restaurant.name}!
              </p>
              <Button className="mt-6">Add Review</Button>
            </div>
          ) : (
            restaurant.recommendations.map((recommendation) => (
              <div key={recommendation.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div>
                      <p className="font-medium">
                        {recommendation.user.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{recommendation.user.username}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < recommendation.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {recommendation.reviewText && (
                  <p className="mt-4 text-sm">{recommendation.reviewText}</p>
                )}
                {recommendation.dishRecommendations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Dishes tried:</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {recommendation.dishRecommendations.map((dr) => (
                        <span
                          key={dr.id}
                          className={`rounded-full px-3 py-1 text-xs ${
                            dr.isMustTry
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {dr.dish.name}
                          {dr.isMustTry && ' (Must Try!)'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
