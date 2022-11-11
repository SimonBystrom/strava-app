import { useQuery } from "react-query"
import { trpc } from "../utils/trpc"


import * as api from '../pages/api/strava/getAthleteActivities'

/**
 * Gives the Activities for the currently authenticated user
 */
export const useAthleteActivities = (userId: string, beforeDate?: Date, afterDate?: Date) => {

  const { data: dbTokens, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  const { mutateAsync } = trpc.useMutation(['stravaData.edit'])

  return useQuery(
    ['userActivities', dbTokens],
    () => api.getUserActivities(dbTokens!, beforeDate, afterDate),
    {
      enabled: !!dbTokens && !isLoading,
      // 5 min cached results
      staleTime: 300000,
      onSuccess: (data) => {
        if(data!.expired) {
          mutateAsync({
            ...data!.tokens,
            userId: userId
          })
        }
      }
    }
  )
}
