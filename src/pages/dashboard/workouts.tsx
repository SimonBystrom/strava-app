import { Button, Loader, NumberInput, TextInput } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { Exercise } from "@prisma/client"
import { NextPage } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import Layout from "../../components/layout/layout"
import CreateExercise from "../../components/workoutsMain/createExercise/createWorkout"
import WorkoutsMain from "../../components/workoutsMain/workoutsMain"
import { IUserActivity, IWorkouts, userActivitySchema } from "../../server/validations/userActivity"
import { trpc } from "../../utils/trpc"

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
        {/* <CreateExercise userId={session.id as string} /> */}
        {/* <CreateWorkout userId={session.id as string} /> */}
        {session.id && <WorkoutsMain userId={session.id as string}/> }
      </>
    </Layout>
  )
}


export default Workouts
