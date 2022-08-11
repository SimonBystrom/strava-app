import { StravaData } from "@prisma/client"
import { useEffect } from "react"
// import { Tokens } from "../components/userMain/userMain"
import { useUserStore } from "../stores/userStore"
import { getAthlete, reAuthGetter } from "../utils/strava"
import { trpc } from "../utils/trpc"

/**
 * Reauthenticates the current user if needed.
 */
export const useReAuth = (tokens: StravaData, userId: string) => {
  const {
    athlete,
    setAthlete
  } = useUserStore()
  const {mutateAsync} = trpc.useMutation(['stravaData.edit'])


  useEffect(() => {
    const reAuthenticate = async (tokens: StravaData, userId: string) => {
      const expired = new Date(tokens.expiresAt * 1000) < new Date()

      // console.log('Running expired check with these params -> ', )
      if (expired) {
        console.info('Access token expired -> Reatuh with refreshToken')
        try {
          const newTokens = await reAuthGetter(tokens.refreshToken)
          const stravaTokens = {
            accessToken: newTokens!.accessToken,
            refreshToken: newTokens!.refreshToken,
            expiresAt: newTokens!.expiresAt,
            athlete: newTokens!.athlete,
          }
          localStorage.setItem('strava', JSON.stringify(newTokens))
          // TODO: Check if this actually updates DB properly
          await mutateAsync({
            ...stravaTokens,
            userId: userId
          })

          const athlete = await getAthlete(stravaTokens.accessToken)
          if (!athlete) {
            throw new Error('No Athlete found for current accessToken in local storage. Non-expired token.')
          }
          setAthlete(athlete)
          return
        } catch (err) {
          console.error(err)
          return
        }
      }
      else {
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
          return
        }
      }
    }
    // If there's currently no athlete.id that means that the Zustand store has
    // lost it's athlete data (could be due to refreshed window or something else).
    // If that's the case we need to get the Athlete ID back again since mulitple
    // components depend on having Athlete Data.
    // To be able to get the Athlete ID we need to re-Authenticate.
    if (!athlete?.id && tokens) {
      console.log('REAUTH --> running reauthing', tokens)
      // console.log('No Athlete ID in store -> Reauth')
      // const localStorageObj = localStorage.getItem('strava')
      // const storedTokens = JSON.parse(localStorageObj!)
      reAuthenticate(tokens, userId)
    }
  }, [athlete?.id, setAthlete , mutateAsync, tokens, userId])
}
