import * as z from 'zod'

export const exerciseSchema = z.object({
  name: z.string(),
  reps: z.string().min(1),
  description: z.optional(z.string().min(4).max(240)),
  userId: z.string(),
})

export const workoutSchema = z.object({
  name: z.string(),
  sets: z.number().min(1),
  userId: z.string(),
})

export const userActivitySchema = workoutSchema.extend({
  exercises: z.array(z.object({
    exerciseId: z.string()
  }))
})

export type IExercises = z.infer<typeof exerciseSchema>
export type IWorkouts = z.infer<typeof workoutSchema>
export type IUserActivity = z.infer<typeof userActivitySchema>
