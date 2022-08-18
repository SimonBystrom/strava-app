import { z } from "zod";
import { createRouter } from "./context";

export const userMilestonesRouter = createRouter()
  .query('getMilestones', {
    input: z.object({
      id: z.string()
    }),
    resolve: async ({ input: {id}, ctx}) => {
      // const data = await ctx.prisma.milestone.findMany()
      // console.log(data)
      // return data
      return await ctx.prisma.milestone.findMany({
        where: {
          userId: id
        }
      })
    }
  })
