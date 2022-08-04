import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserStats } from "../utils/strava"
import { useReAuth } from "./reAuth"

/**
 * Gives the Stats for the currently authenticated user
 */
export const useStats = () => {
  const { athlete, accessToken } = useUserStore()

  // Runs the useReAuth to check if re-authentication is neccessary.
  useReAuth()
  return useQuery(
    ['userStats', athlete?.id, accessToken],
    () => getUserStats(athlete?.id, accessToken),
    {
      enabled: !!athlete?.id && !!accessToken,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}
