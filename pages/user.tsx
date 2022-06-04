import { NextPage } from "next";
import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { convertToHourMinSec } from "../utils/secondsConverter";
import { getUserActivities, getUserData } from "../utils/strava";

const User: NextPage = () => {
  const {athlete, accessToken, refreshToken} = useUserStore()

  useEffect(() => {
    const getUserStats = async () => {
        const userStats = await getUserData(athlete.id, accessToken)
        const userActivities = await getUserActivities(accessToken)
        console.log('activities', userActivities)
      convertToHourMinSec(userActivities?.data[0].moving_time)
    }
    if(athlete.id) {
      getUserStats()
    }
  }, [athlete.id, accessToken])
  console.log(athlete)
  return (
    <div>
      Welcome {athlete.lastname}
    </div>
  )
}

export default User
