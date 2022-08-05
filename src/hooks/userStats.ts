import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserStats } from "../utils/strava"
import { trpc } from "../utils/trpc"
import { useReAuth } from "./reAuth"

/**
 * Gives the Stats for the currently authenticated user
 */
export const useStats = () => {
  const { athlete, accessToken } = useUserStore()

  // Runs the useReAuth to check if re-authentication is neccessary.
  useReAuth()
  const {data, isLoading} = useQuery(
    ['userStats', athlete?.id, athlete.id],
    () => getUserStats(athlete?.id, accessToken),
    {
      enabled: !!athlete?.id,
      // 5 min cached results
      staleTime: 300000,
    }
  )
  return {
    data,
    isLoading,
  }
}
