import { useQuery } from "react-query"
import { trpc } from "../utils/trpc"

import * as api from '../pages/api/strava/getAthlete'

/**
 * Gives the Stats for the currently authenticated user
 */
export const useAthleteStats = (userId: string) => {
  console.log('UserAthelte hook id', userId)
  const { data: dbTokens, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  console.log('dbTokens in hook', dbTokens, 'isLoading?', isLoading)
  return useQuery(['getAthlete', userId],
    () => api.getStravaAthlete(dbTokens!),
    {
      enabled: !!dbTokens && !isLoading,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}