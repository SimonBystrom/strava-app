import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserStats } from "../utils/strava"
import { trpc } from "../utils/trpc"
import { useReAuth } from "./reAuth"

/**
 * Gives the Stats for the currently authenticated user
 */
export const useAthleteStats = () => {
  const { athlete } = useUserStore()
  const [accessToken, setAccessToken] = useState<string>('')


  useEffect(() => {
    const localStorageObj = localStorage.getItem('strava')
    const { accessToken } = JSON.parse(localStorageObj!)
    setAccessToken(accessToken)
  }, [])
  // Runs the useReAuth to check if re-authentication is neccessary.

  useReAuth()
  return useQuery(
    ['userStats', athlete?.id, athlete.id],
    () => getUserStats(athlete?.id, accessToken),
    {
      enabled: !!athlete?.id && !!accessToken,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}
