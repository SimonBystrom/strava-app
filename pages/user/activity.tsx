import { NextPage } from "next";
import { useEffect } from "react";
import Layout from "../../components/layout/layout";
import UserActivity from "../../components/userActivity/userActivity";
import { useUserActivitiesStore } from "../../stores/userActivitiesStore";
import { useUserStore } from "../../stores/userStore";
import { getUserActivities } from "../../utils/strava";
import { Pages } from '../../utils/pages'

const ActivityPage: NextPage = () => {
  const { athlete, accessToken } = useUserStore()
  const { setActivities, activities } = useUserActivitiesStore()

  useEffect(() => {
    // const stravaAccessToken = localStorage.getItem('StravaAccessToken')
    const getUserStats = async () => {
      // const userStats = await getUserData(athlete.id, accessToken)
      await getUserActivities(accessToken, setActivities)
      // convertToHourMinSec(userActivities?.data[0].moving_time)
    }
    if (athlete.id) {
      getUserStats()
    }
  }, [athlete.id, accessToken, setActivities])
  console.log('store activity', activities)

  return (
   <Layout activePage='Activity'>
     <UserActivity activities={activities}/>
   </Layout>
  )
}

export default ActivityPage
