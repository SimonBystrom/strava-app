import { NextPage } from "next";
import { useSession } from "next-auth/react";
// import Layout from "../../components/layout/layout";
import Layout from '../../components/layout/layout'
import ActivityMain from "../../components/userActivity/userActivity";
import UserActivity from "../../components/userActivity/userActivity";
import { useActivities } from "../../hooks/userActivities";


const ActivityPage: NextPage = () => {
  const { data: session } = useSession()
  // const { isLoading, data: activities } = useActivities()


  if (!session) {
    return (
      <Layout activePage='Home'>
        <p>Loading ... (session)</p>
      </Layout>
    )
  }

  return (
   <Layout activePage='Activity'>
    {/* <>
      {activities && <UserActivity activities={activities} />}
      {isLoading && <p>Loading ...</p>}
    </> */}
    <>
      {session.id && <ActivityMain userId={session.id as string} />}
    </>
      {/* <UserActivity /> */}
   </Layout>
  )
}

export default ActivityPage
