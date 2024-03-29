import { z } from "zod";
import { stravaDataSchema } from "../validations/auth";
import { createRouter } from "./context";


export const stravaDataRouter = createRouter()
  .mutation('create', {
    input: stravaDataSchema,
    resolve: async ({input, ctx}) => {
      const {accessToken, refreshToken, expiresAt, userId, athleteId} = input

      const results = await ctx.prisma.stravaData.create({
        data: {
          accessToken,
          refreshToken,
          expiresAt,
          athleteId,
          user: {
            connect: {id: userId}
          }
        },
        include: {
          user: true
        }
      })
      return results
    }
  })
  .query('getById', {
    input: z.object({
      id: z.string()
    }),
    resolve: async ({ input: { id }, ctx}) => {
      return await ctx.prisma.stravaData.findFirst({
        where: {
          userId: id
        }
      })
    }
  })
  .mutation('edit', {
    input: stravaDataSchema,
    resolve: async ({input: {userId, refreshToken, accessToken, expiresAt, athleteId}, ctx}) => {
      return ctx.prisma.stravaData.update({
        where: {
          userId
        },
        data: {
          accessToken,
          refreshToken,
          expiresAt,
          athleteId,
        }
      })
    }
  })
