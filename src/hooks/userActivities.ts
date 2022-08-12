import { StravaData } from "@prisma/client"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useUserStore } from "../stores/userStore"
import { getUserActivities } from "../utils/strava"
import { useReAuth } from "./reAuth"

/**
 * Gives the Activities for the currently authenticated user
 */
export const useAthleteActivities = (tokens: StravaData, userId: string) => {
  // Runs the useReAuth to check if re-authentication is neccessary.
  const returnTokens = useReAuth(tokens, userId)
  return useQuery(
    ['userActivities', returnTokens.accessToken],
    () => getUserActivities(returnTokens.accessToken),
    {
      enabled: !!returnTokens.accessToken,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}
