import { useQuery } from "react-query"
import { trpc } from "../utils/trpc"

import * as api from '../pages/api/strava/getAthleteActivities'

/**
 * Gives the Activities for the currently authenticated user
 */
export const useAthleteActivities = (userId: string) => {
  console.log('useAthleteActivites hook id', userId)
  const { data: dbTokens, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  console.log('dbTokens in hook', dbTokens, 'isLoading?', isLoading)

  return useQuery(
    ['userActivities', dbTokens],
    () => api.getUserActivities(dbTokens!),
    {
      enabled: !!dbTokens && !isLoading,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}
