import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Layout from "../../components/layout/layout"
import UserMain from "../../components/userMain/userMain";


const User: NextPage = () => {
  const { data: session } = useSession()


  if (!session) {
    return (
      <Layout activePage='Home'>
        <p>Loading ... (session)</p>
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
