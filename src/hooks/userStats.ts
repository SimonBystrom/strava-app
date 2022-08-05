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
export const useStats = async () => {
  const { athlete } = useUserStore()
  const router = useRouter()
  const id = router.query.id as string
  const {data: stravaData} = await trpc.useQuery(['stravaData.getById', {id: id}], {
    enabled: !!id
  })
  console.log('id', id)
  console.log('strava', stravaData)

  // Runs the useReAuth to check if re-authentication is neccessary.
  await useReAuth()
  return useQuery(
    ['userStats', athlete?.id, stravaData!.accessToken],
    () => getUserStats(athlete?.id, stravaData!.accessToken),
    {
      enabled: !!athlete?.id && !!stravaData,
      // 5 min cached results
      staleTime: 300000,
    }
  )
}
