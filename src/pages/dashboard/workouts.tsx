import { Loader } from "@mantine/core"
import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import Layout from "../../components/layout/layout"
import WorkoutsMain from "../../components/workoutsMain/workoutsMain"

const Workouts: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (status === 'unauthenticated') {
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
        {session.id && <WorkoutsMain userId={session.id as string}/> }
      </>
    </Layout>
  )
}


export default Workouts
