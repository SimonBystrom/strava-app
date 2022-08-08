import { NextPage } from "next";
// import Layout from "../../components/layout/layout";
import Layout from '../../components/layout/layout'
import UserActivity from "../../components/userActivity/userActivity";
import { useActivities } from "../../hooks/userActivities";


const ActivityPage: NextPage = () => {
  const { isLoading, data: activities } = useActivities()

  return (
   <Layout activePage='Activity'>
    <>
      {activities && <UserActivity activities={activities} />}
      {isLoading && <p>Loading ...</p>}
    </>
      {/* <UserActivity /> */}
   </Layout>
  )
}

export default ActivityPage
