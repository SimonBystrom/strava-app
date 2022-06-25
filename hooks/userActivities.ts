import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserActivities } from "../utils/strava"
import { useReAuth } from "./reAuth"

/**
 * Gives the Activities for the currently authenticated user
 */
export const useActivities = () => {
  const { accessToken } = useUserStore()

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
