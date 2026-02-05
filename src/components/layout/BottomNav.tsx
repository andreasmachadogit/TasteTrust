'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Home, Search, PlusCircle, Bookmark, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/feed',
    icon: Home,
    label: 'Home',
  },
  {
    href: '/explore',
    icon: Search,
    label: 'Explore',
  },
  {
    href: '/add',
    icon: PlusCircle,
    label: 'Add',
    isAction: true,
  },
  {
    href: '/saved',
    icon: Bookmark,
    label: 'Saved',
  },
  {
    href: '/profile',
    icon: User,
    label: 'Profile',
    isDynamic: true,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const href = item.isDynamic
            ? session?.user?.username
              ? `/profile/${session.user.username}`
              : '/login'
            : item.href

          const isActive =
            pathname === href ||
            (item.isDynamic && pathname.startsWith('/profile/'))

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
                item.isAction && 'relative'
              )}
            >
              {item.isAction ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <item.icon className="h-6 w-6" />
                </div>
              ) : (
                <>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
