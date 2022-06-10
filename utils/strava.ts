import axios, { AxiosResponse } from "axios"
import { Activity, useUserActivitiesStore } from "../stores/userActivitiesStore"
import { BaseStats } from "../stores/userStatsStore"
import { Athlete } from "../stores/userStore"
import { convertToHourMinSec } from "./secondsConverter"

export const handleLogin = () => {
  const redirectUrl = 'http://localhost:3000/redirect'
  const scope = 'read,activity:read_all'
  // Workaround to get rid of type issue with window.location not being allowed a string https://github.com/microsoft/TypeScript/issues/48949
  const win: Window = window
  win.location = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
}&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`
}

export const authGetter = async (authToken: string) => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_SECRET
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

export const reAuthGetter = async (refreshToken: string) => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_SECRET
  try {
    const response = await axios.post(
      `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`
    )
    localStorage.setItem('StravaAccessToken', response.data.access_token)
    localStorage.setItem('StravaRefreshToken', response.data.refresh_token)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getUserStats = async (userID: Athlete['id'], accessToken: string, setRunningStats: (stats: BaseStats) => void) => {
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

  setRunningStats(parsedResponse)
}

export const getAthlete = async (accessToken: string, setAthlete: (athlete: Athlete) => void) => {
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
  setAthlete(parsedResponse)
}

const parseActivity = (responseItem: any): Activity | null => {
  // do your parsing here and rename the fields as you like
  // if a field fails to parse you can do a console.error to make it clear in the
  // console and return null
  const parsedActivity = {
    type: responseItem.type,
    name: responseItem.name,
    averageSpeed: responseItem.average_speed,
    distance: responseItem.distance,
    maxSpeed: responseItem.max_speed,
    startDateLocal: responseItem.start_date_local,
    elapsedTime: convertToHourMinSec(responseItem.elapsed_time),
    movingTime: convertToHourMinSec(responseItem.moving_time),
  }
  return parsedActivity
}

export const getUserActivities = async (accessToken: string, setActivities: (activities: Activity[]) => void) => {
  let response: AxiosResponse
  try {
    response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities?per_page=30`,
      { headers: { Authorization: `Bearer ${accessToken}`}}
    )
  } catch (error) {
    console.log(error)
    return
  }

  const activities: Activity[] = []
  for (const item of response.data) {
    const activity = parseActivity(item)
    if(activity) {
      activities.push(activity)
    }
  }
  setActivities(activities)
}
