import { StravaData } from "@prisma/client";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import Layout from "../../components/layout/layout"
import UserMain from "../../components/userMain/userMain";
import { useAthleteStats } from "../../hooks/userStats";
import { useUserStore } from "../../stores/userStore";
import { handleLogin } from "../../utils/strava";
import { trpc } from "../../utils/trpc";


const User: NextPage = () => {
  const { athlete } = useUserStore()
  const { data: session } = useSession()
  // const [userData, setUserData] = useState<StravaData | null>(null
  // const [isLoading, setIsLoading] = useState<boolean>(true)
  // const {data: userStravaProfile, isLoading} = useQuery(
  //   []
  // )
  // FIX THIS
  const { data: userData, isLoading } = trpc.useQuery(['stravaData.getById', { id: session?.user?.id }], {
    enabled: !!session?.user
  })

  // useEffect(() => {
  //   if(session?.user) {
  //     const {data: userData, isLoading} = trpc.useQuery(['stravaData.getById', {id: session.user.id}])
  //     if(userData) {
  //       setUserData(userData)
  //       setIsLoading(false)
  //       return
  //     }
  //   }
  // }, [session])
  // const {data: userStats, isLoading} = useAthleteStats()

  return (
    <Layout activePage='Home'>
      <>
        {!userData && isLoading &&
          <div>
            <button onClick={() => handleLogin()}>Connect to strava</button>
          </div>
        }
        <p>Connected!</p>
        {/* {userStats && <UserMain athlete={athlete} runningsStats={userStats} />} */}
        {/* {isLoading && <p>Loading ...</p>} */}
      </>
    </Layout>
  )
}


export default User
