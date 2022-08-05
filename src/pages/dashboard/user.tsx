import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../components/layout/layout"
import UserMain from "../../components/userMain/userMain";
import { useStats } from "../../hooks/userStats";
import { useUserStore } from "../../stores/userStore";
import { trpc } from "../../utils/trpc";


const User: NextPage = () => {
  const { athlete } = useUserStore()
  const {data: userStats, isLoading} = useStats()
  // const { isLoading, data: userStats } = useStats()
  // const { data: userStats } = useStats()
  // console.log('---> ', userStats)
  const router = useRouter()
  const id = router.query.id as string

  // TODO: FIX RELOAD AND REAUTH -> SAVE ON USER PROFILE AND CHECK ON RELOAD THE SESSION
  // -> REFETCH ACCORDING TO SESSION REFRECH TOKES ETC
  return (
    <Layout activePage='Home'>
      <>
        {userStats && <UserMain athlete={athlete} runningsStats={userStats} />}
        {isLoading && <p>Loading ...</p>}
      </>
    </Layout>
  )
}


export default User
