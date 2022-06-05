import { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/layout/layout";
import UserMain from "../components/userMain/userMain";
import { Activity, useUserActivitiesStore } from "../stores/userActivitiesStore";
import { useUserStore } from "../stores/userStore";
import { convertToHourMinSec } from "../utils/secondsConverter";
import { getUserActivities, getUserData, handleLogin } from "../utils/strava";

const User: NextPage = () => {
  const {athlete, accessToken, refreshToken} = useUserStore()
  const { setActivities, activities } = useUserActivitiesStore()
  const router = useRouter()

  useEffect(() => {
    // const stravaAccessToken = localStorage.getItem('StravaAccessToken')
    const getUserStats = async () => {
        // const userStats = await getUserData(athlete.id, accessToken)
        // await getUserActivities(accessToken, setActivities)
      // convertToHourMinSec(userActivities?.data[0].moving_time)
    }
    if (athlete.id) {
      getUserStats()
    }
  }, [athlete.id, accessToken, setActivities])



  if (!athlete.id) {
    return (
      <div>
        No log in info found...
        <button onClick={handleLogin}>Connect to Strava</button>
      </div>
    )
  }
  return (
    <Layout activePage='Home'>
      <UserMain athlete={athlete}/>
    </Layout>
  )
}

export default User
