import { useRouter } from "next/router"
import { useEffect } from "react"
import { useUserStore } from "../stores/userStore"
import { getAthlete, handleLogin, reAuthGetter } from "../utils/strava"

/**
 * Reauthenticates the current user if needed.
 */
export const useReAuth = () => {
  const { athlete, setAccessToken, setRefreshToken, setAthlete } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    const reAuthenticate = async () => {
      // Get's the refresh token saved in LocalStorage.
      const refreshToken = localStorage.getItem('StravaRefreshToken') as string
      // If there's a refreshToken in Local storage we try to reAuthenticate using said refresh
      // token.

      // TODO: Check if Refresh Token is expired
      if (refreshToken) {
        try {
          const tokens = await reAuthGetter(refreshToken)
          // If there's no tokens we need a hard authentication (to get new Tokens)
          if (!tokens) {
            console.info('No Tokens found on re-authentication attempt.')
            return handleLogin
          }
          setAccessToken(tokens.access_token)
          setRefreshToken(tokens.refresh_token)

          const athlete = await getAthlete(tokens.access_token)

          if (!athlete) {
            console.info('No Athlete found for the current access_token...')
            return handleLogin
          }
          setAthlete(athlete)

        } catch (err) {
          console.error(err)
        }
      } else {
        console.info('No Refresh Token in local storage and no current client in Zustand store')
        return handleLogin
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
