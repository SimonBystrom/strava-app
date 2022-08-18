import axios, { AxiosResponse } from "axios"
import { Athlete } from "../../../types/stravaTypes"

type AuthResponse = {
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  athlete: Athlete,
}

export const authenticateAthlete = async (
  authToken: string
) => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET

  if(authToken) {
    let response: AxiosResponse
    try {
      response = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${authToken}&grant_type=authorization_code`
      )
    } catch (error) {
      console.log(error)
      return
    }

    const tokens: AuthResponse = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: response.data.expires_at,
      athlete: response.data.athlete
    }
    return tokens

  }
  return
}
