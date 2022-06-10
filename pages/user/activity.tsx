import { NextPage } from "next";
import { useEffect } from "react";
import Layout from "../../components/layout/layout";
import UserActivity from "../../components/userActivity/userActivity";
import { useUserActivitiesStore } from "../../stores/userActivitiesStore";
import { useUserStore } from "../../stores/userStore";
import { getUserActivities, reAuthGetter } from "../../utils/strava";
import { Pages } from '../../utils/pages'

const ActivityPage: NextPage = () => {
  const { athlete, accessToken, setAthlete, setAccessToken, setRefreshToken } = useUserStore()
  const { setActivities, activities } = useUserActivitiesStore()



  useEffect(() => {
    const reAuthenticate = async () => {
      const refreshToken = localStorage.getItem('StravaRefreshToken')
      const tokens = await reAuthGetter(refreshToken as string)
      setAccessToken(tokens.access_token)
      setRefreshToken(tokens.refresh_token)
      return tokens
    }
    const getUserStats = async () => {
      if (athlete.id) {
        return await getUserActivities(accessToken, setActivities)
      }
      if (!athlete.id) {
        const newTokens = await reAuthenticate()
        // Need to call with the new refreshToken. Can't be taken from the store yet, coz it's not been
        // completely set when we try to call this function.
        return await getUserActivities(newTokens.access_token, setActivities)
      }
    }
    getUserStats()
  }, [athlete.id, accessToken, setActivities, setAccessToken, setRefreshToken])
  console.log('store activity', activities)

  return (
   <Layout activePage='Activity'>
     <UserActivity activities={activities}/>
   </Layout>
  )
}

export default ActivityPage
