import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { Search, MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default async function AddRecommendationPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/add')
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add Recommendation</h1>
        <p className="mt-2 text-muted-foreground">
          Share a restaurant you love with your followers
        </p>
      </div>

      {/* Search for Restaurant */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Restaurant</CardTitle>
          <CardDescription>
            Search for an existing restaurant or add a new one
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search restaurants by name..."
              className="pl-9"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or add a new restaurant
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add New Restaurant
          </Button>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <div className="mt-8 rounded-lg bg-muted/50 p-4">
        <h3 className="font-medium">Tips for great recommendations</h3>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Include specific dish recommendations</span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Mark your must-try dishes</span>
          </li>
          <li className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Add photos to help others know what to expect</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
