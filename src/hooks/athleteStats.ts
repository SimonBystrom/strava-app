import { useQuery } from "react-query"
import { trpc } from "../utils/trpc"

import * as api from '../pages/api/strava/getAthlete'
import { useEffect } from "react"

/**
 * Gives the Stats for the currently authenticated user
 */
export const useAthleteStats = (userId: string) => {
  const { data: dbTokens, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  const { mutateAsync } = trpc.useMutation(['stravaData.edit'])

  useEffect(() => {

  }, [dbTokens, isLoading])
  return useQuery(['getAthlete', userId],
    () => api.getStravaAthlete(dbTokens!),
    {
      enabled: !!dbTokens && !isLoading,
      // 5 min cached results
      staleTime: 300000,
      onSuccess: (data) => {
        if (data!.expired) {
          mutateAsync({
            ...data!.tokens,
            userId: userId
          })
        }
      }
    }
  )
}
