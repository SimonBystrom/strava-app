import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { goalsRouter } from './goals'

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge("goals.", goalsRouter)

// export type definition of API
export type AppRouter = typeof appRouter
