import axios, { AxiosResponse } from "axios"
import { Activity, useUserActivitiesStore } from "../stores/userActivitiesStore"
import { Athlete } from "../stores/userStore"

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
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const getUserData = async (userID: Athlete['id'], accessToken: string) => {
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athletes/${userID}/stats`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response
  } catch (error) {
    console.log(error)
  }
}

type GetUserResponse = {
  data: Activity[]
}

export const getUserActivities = async (accessToken: string, setActivities: (activities: Activity[]) => void) => {
  try {
    await axios.get<Activity[]>(
      `https://www.strava.com/api/v3/athlete/activities?per_page=30`,
      { headers: { Authorization: `Bearer ${accessToken}`}}
    ).then( response => {
      // TODO: Needs to map over each response, set it to Activity (type) and remove
      // unused fields and change other fields..
      return  setActivities(response.data)
    })
  } catch (error) {
    console.log(error)
  }
}
