import { Button, Loader, NumberInput, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { isNullOrUndefined } from "util";
import Layout from "../../components/layout/layout"
import UserMain from "../../components/userMain/userMain";
import { exerciseSchema, IExercises } from "../../server/validations/exercise";
import { trpc } from "../../utils/trpc";


interface CreateExerciseProps {
  userId: string
}
const CreateExercise: React.FC<CreateExerciseProps> = ({userId}) => {
  const form = useForm({
    validate: zodResolver(exerciseSchema),
    initialValues: {
      name: '',
      reps: '',
      userId: userId,
      description: '',
      workoutId: undefined,
      workoutData: {
        name: '',
        sets: 0
      }
    }
  })
  const {mutateAsync} = trpc.useMutation(["exercises.createExercise"])

  const onSubmit = useCallback(
    async (data: IExercises) => {
      const results = await mutateAsync(data)
      if( results ) {
        console.log('results')
      }
    }, [mutateAsync]
  )

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        label="Exercise name"
        placeholder="ex"
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Reps"
        placeholder="ex"
        {...form.getInputProps('reps')}
      />
      <TextInput
        label="Description"
        placeholder="ex"
        {...form.getInputProps('description')}
      />
      <TextInput
        label="Workout Name"
        placeholder="ex"
        {...form.getInputProps('workoutData.name')}
      />
      <NumberInput
        label='Workout sets'
        placeholder="st"
        {...form.getInputProps('workoutData.sets')}
      />
      <Button variant='filled' type="submit">
        craete
      </Button>
    </form>
  )
}


const User: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
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
        <CreateExercise userId={session.id as string}/>
      </>
    </Layout>
  )
}


export default User
