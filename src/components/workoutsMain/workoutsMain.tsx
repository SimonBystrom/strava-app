import { FC, useCallback, useEffect } from 'react'
import { Avatar, Badge, Button, Card, CardSection, Group, Image, Loader, MultiSelect, NumberInput, Text, TextInput } from '@mantine/core';
import { useAthleteStats } from '../../hooks/athleteStats';
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection';
import { BaseStats } from '../../types/stravaTypes';
import classes from './workoutsMain.module.scss'
import CreateExercise from './createExercise/createWorkout';
import { useForm, zodResolver } from '@mantine/form';
import { trpc } from '../../utils/trpc';
import { IUserActivity, userActivitySchema } from '../../server/validations/userActivity';
import { Exercise } from '@prisma/client';

interface CreateWorkoutProps {
  userId: string
  exercises: Exercise[]
}

const CreateWorkout: React.FC<CreateWorkoutProps> = ({ userId, exercises }) => {

  const form = useForm({
    validate: zodResolver(userActivitySchema),
    initialValues: {
      name: '',
      sets: 0,
      userId,
      exercises: exercises.map(exercise => ({
        exerciseId: exercise.id
      }))
    }
  })
  const { mutateAsync } = trpc.useMutation(["exercises.createWorkout"])

  const onSubmit = useCallback(
    async (data: IUserActivity) => {
      const results = await mutateAsync(data)
      if (results) {
        console.log('---->', results)
        form.reset()
      }
    }, [mutateAsync, form]
  )

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        label="Workout name"
        placeholder="ex"
        {...form.getInputProps('name')}
      />
      <NumberInput
        label="Sets"
        placeholder="ex"
        {...form.getInputProps('sets')}
      />
      <MultiSelect
        label='Exercises'
        placeholder='ex'
        data={exercises.map(e => ({
          label: e.name,
          value: e.id
        }))}
      />
      <Button variant='filled' type="submit">
        craete
      </Button>
    </form>
  )
}



interface WorkoutMainProps {
  userId: string
}

const WorkoutsMain: FC<WorkoutMainProps> = ({ userId }) => {
  const {data: exercises, isLoading} = trpc.useQuery(['exercises.getAllExercises', {userId: userId}])

  if (isLoading) {
    return (
      <>
        <Loader></Loader>
        <p>User Main loader</p>
      </>
    )
  }

  // TODO: Display all users Workouts
  // Have modals on Create exercise and create workout
  // Display created exercises somewhere for edit aswell
  // add edit to workouts as well

  return (
    <>
      <CreateExercise userId={userId}/>
      {exercises && <CreateWorkout userId={userId} exercises={exercises}/>}
    </>
  )
}

export default WorkoutsMain
