import { StravaData } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { BaseStats } from "../../../types/stravaTypes"
// import { BaseStats } from "../../../stores/userStatsStore"
import { convertToHourMinSec } from "../../../utils/timeConverter"


type AuthResponse = {
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
}

export const getStravaAthlete = async (
  dbTokens: StravaData,
) => {
  console.log('API dbTokens', dbTokens)
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET

  if(dbTokens) {
    console.log('Starting fetch based on db Tokens ...')
    let response: AxiosResponse

    try {
      response = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${dbTokens.refreshToken}&grant_type=refresh_token`
      )
    } catch (error) {
      console.log(error)
      return
    }

    const tokens: AuthResponse = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresAt: response.data.expires_at,
    }

    let athleteData: AxiosResponse
    try {
      athleteData = await axios.get(
        `https://www.strava.com/api/v3/athletes/${dbTokens.athleteId}/stats`,
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      )
    } catch (error) {
      console.log(error)
      return
    }

    const parsedResponse: BaseStats = {
      count: athleteData.data.all_run_totals.count,
      distance: athleteData.data.all_run_totals.distance,
      elapsedTime: convertToHourMinSec(athleteData.data.all_run_totals.elapsed_time),
      elevationGain: athleteData.data.all_run_totals.elevation_gain,
      movingTime: convertToHourMinSec(athleteData.data.all_run_totals.moving_time)
    }

    return parsedResponse
  }
  return
}
