import { z } from "zod"
import { exerciseSchema, userActivitySchema, workoutSchema } from "../validations/userActivity"
import { createRouter } from "./context"

export const userActivityRouter = createRouter()
  .query('getUserExercises', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      return await ctx.prisma.exercise.findMany({
        where: {
          userId: userId
        }
      })
    }
  })
  .query('getAllExercises', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      return await ctx.prisma.exercise.findMany()
    }
  })
  .query('getUserWorkouts', {
    input: z.object({
      userId: z.string()
    }),
    resolve: async ({input: {userId}, ctx}) => {
      return await ctx.prisma.workout.findMany({
        where: {
          userId: userId
        }
      })
    }
  })
  .mutation('createExercise', {
    input: exerciseSchema,
    resolve: async ({input, ctx}) => {
      const {name, reps, description, userId} = input
      return await ctx.prisma.exercise.create({
        data: {
          name,
          reps,
          description,
          user: {
            connect: {
              id: userId
            }
          },
        },
        include: {
          user: true
        }
      })
    }
  })
  .mutation('createWorkout', {
    input: userActivitySchema,
    resolve: async ({input, ctx}) => {
      const {name, sets, userId, exercises} = input
      const workout = await ctx.prisma.workout.create({
        data: {
          name,
          sets,
          user: {
            connect: {
              id: userId
            }
          }
        }
      })

      for(let exerciseData of exercises) {
        await ctx.prisma.userActivity.create({
          data: {
            user: {
              connect: {
                id: userId
              }
            },
            workout: {
              connect: {
                id: workout.id
              }
            },
            exercise: {
              connect: {
                id: exerciseData.exerciseId
              }
            }
          }
        })
      }
      const results = await ctx.prisma.userActivity.findMany({
        where: {
          workoutId: workout.id
        },
        include: {
          exercise: true,
          workout: true,
        }
      })
      const allExercises = results.map(data => data.exercise)
      return {
        workout: results[0]?.workout,
        exercises: allExercises
      }
     /**
      * desired results: {
      *   workout: -> workout,
      *   exercises: [exercise{}, exercise{}]
      * }
      * */
    }
  })
