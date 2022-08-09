import { Loader } from "@mantine/core";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import ActivityMain from "../../components/activityMain/activityMain";
import Layout from '../../components/layout/layout'


const ActivityPage: NextPage = () => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Layout activePage='Home'>
        <Loader size='xl'/>
      </Layout>
    )
  }

  return (
   <Layout activePage='Activity'>
    <>
      {session.id && <ActivityMain userId={session.id as string} />}
    </>
   </Layout>
  )
}

export default ActivityPage
