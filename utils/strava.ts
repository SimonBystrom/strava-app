import axios from "axios"
import { Athlete } from "../stores/userStore"

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

export const getUserActivities = async (accessToken: string) => {
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities?per_page=30`,
      { headers: { Authorization: `Bearer ${accessToken}`}}
    )
    return response
  } catch (error) {
    console.log(error)
  }
}
