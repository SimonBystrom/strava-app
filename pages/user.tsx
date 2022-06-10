import { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/layout/layout";
import UserMain from "../components/userMain/userMain";
import { Activity, useUserActivitiesStore } from "../stores/userActivitiesStore";
import { useUserStatsStore } from "../stores/userStatsStore";
import { useUserStore } from "../stores/userStore";
import { convertToHourMinSec } from "../utils/secondsConverter";
import { authGetter, getAthlete, getUserActivities, getUserStats, handleLogin, reAuthGetter } from "../utils/strava";

const User: NextPage = () => {
  const { athlete, accessToken, refreshToken, setAccessToken, setRefreshToken, setAthlete } = useUserStore()
  const {runningStats, setRunningStats} = useUserStatsStore()
  const router = useRouter()

  useEffect(() => {
    const reAuthenticate = async () => {
      const refreshToken = localStorage.getItem('StravaRefreshToken')
      const tokens = await reAuthGetter(refreshToken as string)
      setAccessToken(tokens.access_token)
      setRefreshToken(tokens.refresh_token)
      return tokens
    }
    const getUserData = async () => {
      if (athlete.id) {
        return await getUserStats(athlete.id, accessToken, setRunningStats)
      }
      if (!athlete.id) {
        const newTokens = await reAuthenticate()
        await  getAthlete(newTokens.access_token, setAthlete)
        // Need to call with the new refreshToken. Can't be taken from the store yet, coz it's not been
        // completely set when we try to call this function.
        // const currentAthleteId = localStorage.getItem('StravaAthleteId')
        // if(currentAthleteId) {
        //   return await getUserData(parseInt(currentAthleteId, 10), newTokens.access_token)
        // }
        // console.log('new',newTokens)
      }
    }
    getUserData()
  }, [athlete.id, accessToken, setAccessToken, setRefreshToken, setAthlete, setRunningStats])


  if (!athlete.id) {
    return (
      <Layout activePage='Home'>
        <>
          <p>Loading ...</p>
          {/* <button onClick={handleLogin}>Connect to Strava</button> */}
        </>
      </Layout>
    )
  }
  return (
    <Layout activePage='Home'>
      <UserMain athlete={athlete} runningsStats={runningStats}/>
    </Layout>
  )
}


export default User
