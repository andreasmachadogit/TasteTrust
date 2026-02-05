import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Utensils, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TasteTrust</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Restaurant recommendations from{' '}
              <span className="text-primary">people you trust</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Arrive in any city and instantly see personalised recommendations
              from friends and food lovers you follow. Know exactly which
              restaurant to visit and what to order.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Discovering
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Restaurants
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Why TasteTrust?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Users className="h-8 w-8" />}
                title="Trust-Based Recommendations"
                description="Follow food lovers whose taste matches yours. See what they love, not generic crowd-sourced rankings."
              />
              <FeatureCard
                icon={<MapPin className="h-8 w-8" />}
                title="City-Based Discovery"
                description="Select any city and instantly see restaurants recommended by people you follow on an interactive map."
              />
              <FeatureCard
                icon={<Star className="h-8 w-8" />}
                title="Must-Try Dishes"
                description="Know exactly what to order with specific dish recommendations marked as must-try by your trusted circle."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Ready to find your next meal?</h2>
            <p className="mt-4 text-muted-foreground">
              Join TasteTrust and start discovering restaurants recommended by
              people you trust.
            </p>
            <Link href="/register" className="mt-8 inline-block">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TasteTrust. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-card-foreground">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
