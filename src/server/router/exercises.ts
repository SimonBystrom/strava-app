import { z } from "zod"
import { exerciseSchema } from "../validations/exercise"
import { createRouter } from "./context"

export const exercisesRouter = createRouter()
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
  .mutation('createExercise', {
    input: exerciseSchema,
    resolve: async ({input, ctx}) => {
      const {name, reps, description, workoutData, userId, workoutId} = input

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
          workouts: {
            connectOrCreate: [
              {
                create: {
                  name: workoutData.name,
                  sets: workoutData.sets
                },
                where: {
                  id: workoutId
                }
              }
            ]
          }
        },
        include: {
          workouts: true,
          user: true
        }
      })
    }
  })
