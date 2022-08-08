import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserActivities } from "../utils/strava"
import { useReAuth } from "./reAuth"

/**
 * Gives the Activities for the currently authenticated user
 */
export const useActivities = () => {
  // const { accessToken } = useUserStore()
  const [accessToken, setAccessToken] = useState<string>('')


  useEffect(() => {
    const localStorageObj = localStorage.getItem('strava')
    const { accessToken } = JSON.parse(localStorageObj!)
    setAccessToken(accessToken)
  }, [])
  // Runs the useReAuth to check if re-authentication is neccessary.
  useReAuth()
  return useQuery(
    ['userActivities', accessToken],
    () => getUserActivities(accessToken),
    {
      enabled: !!accessToken,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}
