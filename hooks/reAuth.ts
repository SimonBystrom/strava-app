import { useEffect } from "react"
import { useUserStore } from "../stores/userStore"
import { getAthlete, reAuthGetter } from "../utils/strava"

/**
 * Reauthenticates the current user if needed.
 */
export const useReAuth = () => {
  const { athlete, setAccessToken, setRefreshToken, setAthlete } = useUserStore()

  useEffect(() => {
    const reAuthenticate = async () => {
      // Get's the refresh token saved in LocalStorage.
      const refreshToken = localStorage.getItem('StravaRefreshToken') as string
      // If there's a refreshToken in Local storage we try to reAuthenticate using said refresh
      // token.
      if (refreshToken) {
        try {
          const tokens = await reAuthGetter(refreshToken)

          if (!tokens) return console.info('TODO: No tokens received from reAuth -> Need to hard Authenticate again')

          setAccessToken(tokens.access_token)
          setRefreshToken(tokens.refresh_token)
          await getAthlete(tokens.access_token, setAthlete)
        } catch (err) {
          console.error(err)
        }
      } else {
        console.log('todo: Get new refresh token (complete new auth) -> This will only run if theres no local storage refresh token')
      }
    }
    // If there's currently no athlete.id that means that the Zustand store has
    // lost it's athlete data (could be due to refreshed window or something else).
    // If that's the case we need to get the Athlete ID back again since mulitple
    // components depend on having Athlete Data.
    // To be able to get the Athlete ID we need to re-Authenticate.
    if (!athlete?.id) {
      reAuthenticate()
    }
  }, [athlete?.id, setAccessToken, setRefreshToken, setAthlete])
}
