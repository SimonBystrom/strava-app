import axios, { AxiosResponse } from "axios"
import { useEffect } from "react"
import { useQuery } from "react-query"
import { Activity, useUserActivitiesStore } from "../stores/userActivitiesStore"
import { BaseStats } from "../stores/userStatsStore"
import { Athlete, useUserStore } from "../stores/userStore"
import { convertToHourMinSec } from "./timeConverter"
// import { env } from "../env/server.mjs";

/**
 * Handles the OAuth login redirect to Strava
 */
export const handleLogin = () => {
  const redirectUrl = 'http://localhost:3000/redirect'
  const scope = 'read,activity:read_all'

  // Workaround to get rid of type issue with window.location not being allowed a string https://github.com/microsoft/TypeScript/issues/48949
  const win: Window = window
  win.location = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`
}

/**
 * Handles First Time Authentication & Expired Refresh Token Authentication
 */
export const authGetter = async (authToken: string) => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET
  try {
    const response = await axios.post(
      `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${authToken}&grant_type=authorization_code`
    )
    localStorage.setItem('StravaAthleteId', response.data.athlete.id)
    localStorage.setItem('StravaRefreshToken', response.data.refresh_token)
    console.log('atuth athlete', response.data.athlete)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

type AuthResponse = {
  access_token: string,
  refresh_token: string,
}

/**
 * Handles Re Authentication, used by the useReAuth hook
 */
export const reAuthGetter = async (refreshToken: string) => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_SECRET

  let response: AxiosResponse

  try {
    response = await axios.post(
      `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`
    )
  } catch (error) {
    console.log(error)
    return
  }

  const tokens: AuthResponse = {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  }
  return tokens
}

/**
 * Handles fetching of user stats. Used by the useUserStats hook.
 */
export const getUserStats = async (userID: Athlete['id'], accessToken: string) => {
  let response: AxiosResponse
  try {
    response = await axios.get(
      `https://www.strava.com/api/v3/athletes/${userID}/stats`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  } catch (error) {
    console.log(error)
    return
  }

  const parsedResponse: BaseStats = {
    count: response.data.all_run_totals.count,
    distance: response.data.all_run_totals.distance,
    elapsedTime: convertToHourMinSec(response.data.all_run_totals.elapsed_time),
    elevationGain: response.data.all_run_totals.elevation_gain,
    movingTime: convertToHourMinSec(response.data.all_run_totals.moving_time)
  }

  return parsedResponse
}

/**
 * Handles fetching Athlete Info. Used by the useReAuth
 */
export const getAthlete = async (accessToken: string) => {
  let response: AxiosResponse
  try {
    response = await axios.get(
      `https://www.strava.com/api/v3/athlete`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
  } catch (error) {
    console.log(error)
    return
  }

  const parsedResponse: Athlete = {
    id: response.data.id,
    firstname: response.data.firstname,
    lastname: response.data.lastname,
    sex: response.data.sex,
    username: response.data.username,
    weight: response.data.weight,
  }

  return parsedResponse
}

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

/**
 * Handles fetching user Activities. Used by the useUserActivities hook.
 */
export const getUserActivities = async (accessToken: string) => {
  let response: AxiosResponse
  let page = 1
  let allResultsFetched = false
  const activities: Activity[] = []

  // Loop over all pages to get all activities.
  while(!allResultsFetched) {
    try {
      response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?per_page=50&page=${page}`,
        { headers: { Authorization: `Bearer ${accessToken}`}}
      )
    } catch (error) {
      console.log(error)
      return
    }

    if(!!response.data.length) {
      for (const item of response.data) {
        const activity = parseActivity(item)
        if (activity) {
          activities.push(activity)
        }
      }
      page ++
    } else {
      allResultsFetched = true
      break
    }
  }
  return activities
}
