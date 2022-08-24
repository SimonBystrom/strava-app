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
      const {name, reps, description, exerciseTemplateData, userId, exerciseTemplateId} = input

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
          exerciseTemplates: {
            connectOrCreate: [
              {
                create: {
                  name: exerciseTemplateData.templateName,
                  sets: exerciseTemplateData.templateSets
                },
                where: {
                  id: exerciseTemplateId
                }
              }
            ]
          }
        },
        include: {
          exerciseTemplates: true,
          user: true
        }
      })
    }
  })
