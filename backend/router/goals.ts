import * as trpc from '@trpc/server';

import { z } from 'zod';
import { prisma } from '../../db/client'
import superjson from 'superjson'

export const goalsRouter = trpc
  .router()
  .transformer(superjson)
  .query('get-all', {
    async resolve() {
      return await prisma.goals.findMany()
    }
  })
  .mutation('create', {
    input: z.object({
      name: z.string().min(3).max(50),
    }),

    async resolve({input}) {
      return await prisma.goals.create({
        data: {
          name: input.name,
        }
      })
    }
  })
