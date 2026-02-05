import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and a number'
    ),
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
})

// User schemas
export const updateProfileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

// Restaurant schemas
export const createRestaurantSchema = z.object({
  name: z
    .string()
    .min(1, 'Restaurant name is required')
    .max(100, 'Name must be less than 100 characters'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  cuisineType: z.string().min(1, 'Cuisine type is required'),
  priceRange: z.number().int().min(1).max(4),
  googlePlaceId: z.string().optional(),
})

// Recommendation schemas
export const createRecommendationSchema = z.object({
  restaurantId: z.string().uuid('Invalid restaurant ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  reviewText: z.string().max(2000, 'Review must be less than 2000 characters').optional(),
  visitDate: z.string().datetime().optional(),
  dishes: z
    .array(
      z.object({
        dishId: z.string().uuid().optional(),
        name: z.string().min(1, 'Dish name is required'),
        description: z.string().optional(),
        photoUrl: z.string().url().optional(),
        isMustTry: z.boolean().default(false),
        notes: z.string().optional(),
      })
    )
    .optional(),
})

// Dish schemas
export const createDishSchema = z.object({
  restaurantId: z.string().uuid('Invalid restaurant ID'),
  name: z.string().min(1, 'Dish name is required').max(100),
  description: z.string().max(500).optional(),
  photoUrl: z.string().url('Invalid photo URL').optional(),
})

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>
export type CreateRecommendationInput = z.infer<typeof createRecommendationSchema>
export type CreateDishInput = z.infer<typeof createDishSchema>
