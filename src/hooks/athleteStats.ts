import { useQuery } from "react-query"
import { trpc } from "../utils/trpc"

import * as api from '../pages/api/strava/getAthlete'
import { useEffect } from "react"

/**
 * Gives the Stats for the currently authenticated user
 */
export const useAthleteStats = (userId: string) => {
  console.log('UserAthelte hook id', userId)
  const { data: dbTokens, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  const { mutateAsync } = trpc.useMutation(['stravaData.edit'])

  useEffect(() => {

  }, [dbTokens, isLoading])
  console.log('dbTokens in hook', dbTokens, 'isLoading?', isLoading)
  return useQuery(['getAthlete', userId],
    () => api.getStravaAthlete(dbTokens!),
    {
      enabled: !!dbTokens && !isLoading,
      // 5 min cached results
      staleTime: 300000,
      onSuccess: (data) => {
        console.log('data in stats hook', data)
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
