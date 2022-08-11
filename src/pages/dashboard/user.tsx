import { Loader } from "@mantine/core";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/layout"
import UserMain from "../../components/userMain/userMain";


const User: NextPage = () => {
  const { data: session } = useSession()
  console.log('Session ---> ', session)
  if (!session) {
    return (
      <Layout activePage='Home'>
        <Loader size="xl" />
      </Layout>
    )
  }

  return (
    <Layout activePage='Home'>
      <>
        {session.id && <UserMain userId={session.id as string}/>}
      </>
    </Layout>
  )
}


export default User
