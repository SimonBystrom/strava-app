import { StravaData } from "@prisma/client"
import axios, { AxiosResponse } from "axios"
import { truncate } from "fs/promises"
import { request } from "http"
import { RequestOptions } from "https"
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

const asyncCalls = async (
  tokens: AuthResponse,
  beforeDate?: Date,
  afterDate?: Date,
  ) => {
  let arr_results: any[] | AxiosResponse<any, any> | PromiseLike<AxiosResponse<any, any>> = []
  const PER_PAGE = 50
  let page = 1
  let toContinue = true
  const beforeDateEpochStamp = beforeDate ? Math.floor(beforeDate.getTime() / 1000) : undefined
  const afterDateEpochStamp = afterDate ? Math.floor(afterDate.getTime() / 1000) : undefined
  // Loop over all pages to get all activities.
  while (toContinue) {
    let result: AxiosResponse[] = []

    if (page === 1 || result.length === PER_PAGE) {
      result = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?per_page=${PER_PAGE}&page=${page}${beforeDate && `&before=${beforeDateEpochStamp}`}${afterDate && `&after=${afterDateEpochStamp}`}`,
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      )
      page++
    } else if (result.length < PER_PAGE) {
      toContinue = false
    }
    arr_results = arr_results.concat(result)
  }
  return new Promise(resolve => {
    resolve(arr_results)
  })
}

/**
 * Handles fetching user Activities. Used by the useUserActivities hook.
 */
export const getUserActivities = async (
  dbTokens: StravaData,
  beforeDate?: Date,
  afterDate?: Date,
) => {

  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET

  if (dbTokens) {
    let response: AxiosResponse
    let tokens: AuthResponse


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
    let allResults = await asyncCalls(tokens, beforeDate, afterDate)
    for (const item of allResults.data) {
      const activity = parseActivity(item)
      if (activity) {
        activities.push(activity)
      }
    }
    return {
      res: activities,
      runs: activities.filter(activity => activity.type === 'Run'),
      expired,
      tokens,
    }
  }
  return
}


// for (const item of activityRes.data) {
//   const activity = parseActivity(item)
//   if (activity) {
//     activities.push(activity)
//   }
// }
