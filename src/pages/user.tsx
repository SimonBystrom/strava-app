import { NextPage } from "next";
import Layout from "../components/layout/layout";
import UserMain from "../components/userMain/userMain";
import { useStats } from "../hooks/userStats";
import { useUserStore } from "../stores/userStore";


const User: NextPage = () => {
  const { athlete } = useUserStore()
  const { isLoading, data: userStats } = useStats()

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
