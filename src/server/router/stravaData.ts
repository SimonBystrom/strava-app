import { z } from "zod";
import { stravaDataSchema } from "../validations/auth";
import { createRouter } from "./context";


export const stravaDataRouter = createRouter()
  .mutation('create', {
    input: stravaDataSchema,
    resolve: async ({input, ctx}) => {
      const {accessToken, refreshToken, expiresAt, userId} = input

      const results = await ctx.prisma.stravaData.create({
        data: {
          accessToken,
          refreshToken,
          expiresAt,
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
    input: z.object({
      id: z.string(),
      refreshToken: z.string(),
      accessToken: z.string(),
      expiresAt: z.number()
    }),
    resolve: async ({input: {id, refreshToken, accessToken, expiresAt}, ctx}) => {
      const stravaData = ctx.prisma.stravaData.update({
        where: {
          id
        },
        data: {
          accessToken,
          refreshToken,
          expiresAt,
        }
      })
    }
  })
