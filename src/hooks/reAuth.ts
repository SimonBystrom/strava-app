import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUserStore } from "../stores/userStore"
import { getAthlete, getUserStats, handleLogin, reAuthGetter } from "../utils/strava"
import { trpc } from "../utils/trpc"

/**
 * Reauthenticates the current user if needed.
 */
export const useReAuth = () => {
  const {
    athlete,
    expiresAt,
    accessToken,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    setExpiresAt,
    setAthlete
  } = useUserStore()
  const router = useRouter()
  const id = router.query.id as string
  const { data: stravaData } = trpc.useQuery(['stravaData.getById', { id: id }], {
    enabled: !!id
  })
  const {mutateAsync} = trpc.useMutation(['stravaData.edit'])


  useEffect(() => {
    const reAuthenticate = async () => {
      let expired
      const localStorageObj = localStorage.getItem('strava')
      const storedTokens = JSON.parse(localStorageObj!)
      if(expiresAt) {
        expired = new Date(expiresAt * 1000) > new Date()
      }
      expired = new Date(storedTokens.expiredAt * 1000) > new Date()
      if (expired) {
        console.info('Access token expired')
        if(refreshToken) {
          const tokens = await reAuthGetter(refreshToken)
          const stravaTokens = {
            accessToken: tokens!.accessToken,
            refreshToken: tokens!.refreshToken,
            expiresAt: tokens!.expiresAt
          }
          // TODO: Clean this up
          setAccessToken(stravaTokens.accessToken)
          setRefreshToken(stravaTokens.refreshToken)
          setExpiresAt(stravaTokens.expiresAt)
          localStorage.setItem('strava', JSON.stringify(stravaTokens))
          const athlete = await getAthlete(stravaTokens.accessToken)
          if(!athlete) {
            console.info('No athlete found for the current access token')
            return
          }
          setAthlete(athlete)
          return
        }
        const newTokens = await reAuthGetter(storedTokens.refreshToken)
        const stravaTokens = {
          accessToken: newTokens!.accessToken,
          refreshToken: newTokens!.refreshToken,
          expiresAt: newTokens!.expiresAt
        }
        setAccessToken(stravaTokens.accessToken)
        setRefreshToken(stravaTokens.refreshToken)
        setExpiresAt(stravaTokens.expiresAt)
        localStorage.setItem('strava', JSON.stringify(stravaTokens))

        const athlete = await getAthlete(stravaTokens.accessToken)
        if (!athlete) {
          console.info('No athlete found for the current access token')
          return
        }
        setAthlete(athlete)
        return
      }
      if(accessToken) {
        console.log('access found in bla')
        const athlete = await getAthlete(accessToken)
        if(!athlete) {
          console.info('no athlete found for access token')
          return
        }
        setAthlete(athlete)
        return
      }
      console.log('access NOT found in bla')
      const athlete = await getAthlete(storedTokens.accessToken)
      if (!athlete) {
        console.info('no athlete found for access token')
        return
      }
      setAccessToken(storedTokens.accessToken)
      setRefreshToken(storedTokens.refreshToken)
      setExpiresAt(storedTokens.expiresAt)
      setAthlete(athlete)
      return
      // if(stravaData) {
      //   // Not expired
      //   if(stravaData.expiresAt < new Date()) {
      //     try {
      //       const athlete = await getAthlete(stravaData.accessToken)
      //       if(!athlete) {
      //         console.info('No Athlete found for the current access_token...')
      //         return
      //       }
      //       setAthlete(athlete)
      //       return
      //     } catch (err) {
      //       console.error(err)
      //     }
      //   }
      //   try {
      //     const tokens = await reAuthGetter(stravaData.refreshToken)
      //     if (!tokens) {
      //       console.info('No Tokens found on re-authentication attempt.')
      //       return
      //     }
      //     const {refreshToken, accessToken, expiresAt} = tokens
      //     await mutateAsync({
      //       id: stravaData.id,
      //       refreshToken,
      //       accessToken,
      //       expiresAt: new Date(expiresAt * 1000)
      //     })
      //     return
      //   } catch (err) {
      //     console.error(err)
      //   }
      // }
      // return console.info('No Strava Data in DB')
    }
    // If there's currently no athlete.id that means that the Zustand store has
    // lost it's athlete data (could be due to refreshed window or something else).
    // If that's the case we need to get the Athlete ID back again since mulitple
    // components depend on having Athlete Data.
    // To be able to get the Athlete ID we need to re-Authenticate.
    if (!athlete?.id) {
      console.log('asdasd')
      reAuthenticate()
    }
  }, [athlete?.id, setAccessToken, setRefreshToken, setAthlete, id, stravaData, mutateAsync])
}
