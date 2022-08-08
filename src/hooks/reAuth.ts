import { useEffect } from "react"
import { useUserStore } from "../stores/userStore"
import { getAthlete, reAuthGetter } from "../utils/strava"
import { trpc } from "../utils/trpc"

/**
 * Reauthenticates the current user if needed.
 */
export const useReAuth = () => {
  const {
    athlete,
    setAthlete
  } = useUserStore()
  const {mutateAsync} = trpc.useMutation(['stravaData.edit'])


  useEffect(() => {
    const reAuthenticate = async (tokens: {
      accessToken: string,
      refreshToken: string,
      expiredAt: number,
    }) => {
      // TODO: Check if this expired token and the expired token logic takes the local time into
      // consideration and if it's even relevant.
      const expired = new Date(tokens.expiredAt * 1000) > new Date()
      if (expired) {
        console.info('Access token expired -> Reatuh with refreshToken')
        try {
          const newTokens = await reAuthGetter(tokens.refreshToken)
          const stravaTokens = {
            accessToken: newTokens!.accessToken,
            refreshToken: newTokens!.refreshToken,
            expiresAt: newTokens!.expiresAt
          }
          localStorage.setItem('strava', JSON.stringify(stravaTokens))

          const athlete = await getAthlete(stravaTokens.accessToken)
          if (!athlete) {
            throw new Error('No Athlete found for current accessToken in local storage. Non-expired token.')
          }
          setAthlete(athlete)
          return
        } catch (err) {
          console.error(err)
        }

      }
      try {
        console.log('Current accessToken not expired -> Getting Athlete')
        const athlete = await getAthlete(tokens.accessToken)
        if (!athlete) {
          throw new Error('No Athlete found for current accessToken in local storage. Non-expired token.')
        }
        setAthlete(athlete)
        return
      } catch (err) {
        console.error(err)
      }
    }
    // If there's currently no athlete.id that means that the Zustand store has
    // lost it's athlete data (could be due to refreshed window or something else).
    // If that's the case we need to get the Athlete ID back again since mulitple
    // components depend on having Athlete Data.
    // To be able to get the Athlete ID we need to re-Authenticate.
    if (!athlete?.id) {
      console.log('No Athlete ID in store -> Reauth')
      const localStorageObj = localStorage.getItem('strava')
      const storedTokens = JSON.parse(localStorageObj!)
      reAuthenticate(storedTokens)
    }
  }, [athlete?.id, setAthlete , mutateAsync])
}
