import { Loader } from "@mantine/core";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../components/layout/layout"
import UserMain from "../../components/userMain/userMain";


const User: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  console.log('Sessions status', status, 'session', session)
  useEffect(() => {
    if(status === 'unauthenticated') {
      router.push('/')
      return
    }
  }, [status, router])

  if (status === 'loading' || !session) {
    return (
      <Layout activePage='Home'>
        <>
          <Loader size="xl" />
          <p>Status Loading for session</p>
        </>
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
