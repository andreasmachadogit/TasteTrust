// User types
export interface User {
  id: string
  email: string
  username: string | null
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    followers: number
    following: number
    recommendations: number
  }
}

export interface UserProfile extends User {
  followers: Follow[]
  following: Follow[]
  recommendations: RecommendationWithRestaurant[]
  isFollowing?: boolean
}

// Follow types
export interface Follow {
  followerId: string
  followingId: string
  createdAt: Date
  follower?: User
  following?: User
}

// Restaurant types
export interface Restaurant {
  id: string
  name: string
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  cuisineType: string
  priceRange: number
  googlePlaceId: string | null
  createdById: string
  createdAt: Date
  updatedAt: Date
  createdBy?: User
  _count?: {
    recommendations: number
    dishes: number
  }
}

export interface RestaurantWithDetails extends Restaurant {
  recommendations: RecommendationWithUser[]
  dishes: Dish[]
  averageRating?: number
}

// Dish types
export interface Dish {
  id: string
  restaurantId: string
  name: string
  description: string | null
  photoUrl: string | null
  createdById: string
  createdAt: Date
  createdBy?: User
  restaurant?: Restaurant
}

// Recommendation types
export interface Recommendation {
  id: string
  userId: string
  restaurantId: string
  rating: number
  reviewText: string | null
  visitDate: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface RecommendationWithUser extends Recommendation {
  user: User
  dishRecommendations?: DishRecommendationWithDish[]
}

export interface RecommendationWithRestaurant extends Recommendation {
  restaurant: Restaurant
  dishRecommendations?: DishRecommendationWithDish[]
}

export interface RecommendationFull extends Recommendation {
  user: User
  restaurant: Restaurant
  dishRecommendations: DishRecommendationWithDish[]
}

// Dish Recommendation types
export interface DishRecommendation {
  id: string
  recommendationId: string
  dishId: string
  isMustTry: boolean
  notes: string | null
}

export interface DishRecommendationWithDish extends DishRecommendation {
  dish: Dish
}

// Saved Restaurant types
export interface SavedRestaurant {
  userId: string
  restaurantId: string
  notes: string | null
  createdAt: Date
  restaurant?: Restaurant
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Search types
export interface SearchResult {
  users: User[]
  restaurants: Restaurant[]
}

// Map types
export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  name: string
  rating: number
  cuisineType: string
  priceRange: number
  recommendationCount: number
}

// Filter types
export interface RestaurantFilters {
  city?: string
  cuisineType?: string
  priceRange?: number
  followingOnly?: boolean
}

// Form types
export interface RecommendationFormData {
  restaurantId?: string
  newRestaurant?: {
    name: string
    address: string
    city: string
    country: string
    latitude: number
    longitude: number
    cuisineType: string
    priceRange: number
  }
  rating: number
  reviewText?: string
  visitDate?: string
  dishes: {
    id?: string
    name: string
    description?: string
    photoUrl?: string
    isMustTry: boolean
    notes?: string
  }[]
}
