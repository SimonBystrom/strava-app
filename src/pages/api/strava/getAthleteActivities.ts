import { StravaData } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { Activity } from "../../../types/stravaTypes"
import { convertToHourMinSec } from "../../../utils/timeConverter"

/**
 * Parses activities to correct Type
 */
const parseActivity = (responseItem: any): Activity | null => {
  const parsedActivity = {
    type: responseItem.type,
    name: responseItem.name,
    averageSpeed: responseItem.average_speed,
    distance: responseItem.distance,
    maxSpeed: responseItem.max_speed,
    startDateLocal: responseItem.start_date_local,
    elapsedTime: convertToHourMinSec(responseItem.elapsed_time),
    movingTime: convertToHourMinSec(responseItem.moving_time),
    unparsedTime: responseItem.elapsed_time,
  }
  return parsedActivity
}

type AuthResponse = {
  accessToken: string,
  refreshToken: string,
  expiresAt: number,
  athleteId: number,
}

/**
 * Handles fetching user Activities. Used by the useUserActivities hook.
 */
export const getUserActivities = async (
  dbTokens: StravaData,
) => {

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET

  if (dbTokens) {
    let response: AxiosResponse
    let activityRes: AxiosResponse
    let tokens: AuthResponse
    let page = 1
    let allResultsFetched = false
    const activities: Activity[] = []
    const expired = new Date(dbTokens.expiresAt * 1000) < new Date()
    if(expired) {
      try {
        response = await axios.post(
          `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${dbTokens.refreshToken}&grant_type=refresh_token`
        )
      } catch (error) {
        console.log(error)
        return
      }
      tokens = {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: response.data.expires_at,
        athleteId: dbTokens.athleteId
      }
    } else {
      tokens = {
        accessToken: dbTokens.accessToken,
        refreshToken: dbTokens.refreshToken,
        expiresAt: dbTokens.expiresAt,
        athleteId: dbTokens.athleteId
      }
    }
    // Loop over all pages to get all activities.
    while (!allResultsFetched) {
      try {
        activityRes = await axios.get(
          `https://www.strava.com/api/v3/athlete/activities?per_page=50&page=${page}`,
          { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
        )
      } catch (error) {
        console.log(error)
        return
      }

      if (!!activityRes.data.length) {
        for (const item of activityRes.data) {
          const activity = parseActivity(item)
          if (activity) {
            activities.push(activity)
          }
        }
        page++
      } else {
        allResultsFetched = true
        break
      }
    }
    return {
      res: activities,
      expired,
      tokens,
    }
  }
  return
}
