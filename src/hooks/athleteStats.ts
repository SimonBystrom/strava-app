import { StravaData } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserStats } from "../utils/strava"
import { trpc } from "../utils/trpc"
import { useLocalStorageTokens } from "./localStorageTokens"
import { useReAuth } from "./reAuth"

/**
 * Gives the Stats for the currently authenticated user
 */
export const useAthleteStats = (tokens: StravaData, userId: string) => {
  const { athlete } = useUserStore()
  console.log('Tokens received as props for useAthleteStats', tokens)
  // Runs the useReAuth to check if re-authentication is neccessary.
  const returnTokens = useReAuth(tokens, userId)
  console.log('Return Tokens received after running reAuth', returnTokens)
  return useQuery(
    ['userStats', athlete?.id, athlete.id],
    () => getUserStats(athlete?.id, returnTokens.accessToken),
    {
      enabled: !!athlete?.id && !!returnTokens.accessToken,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}

