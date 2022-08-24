import * as z from 'zod'

export const exerciseSchema = z.object({
  name: z.string(),
  reps: z.string().min(1),
  userId: z.string(),
  description: z.optional(z.string().min(4).max(240)),
  workoutId: z.optional(z.string()),
  workoutData: z.object({
    name: z.string(),
    sets: z.number(),
  })
})

export type IExercises = z.infer<typeof exerciseSchema>
