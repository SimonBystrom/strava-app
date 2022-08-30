import { FC, useCallback, useEffect } from 'react'
import { useAthleteStats } from '../../hooks/athleteStats';
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection';
import { BaseStats } from '../../types/stravaTypes';
import classes from './workoutsMain.module.scss'
import CreateExercise from './createExercise/createWorkout';
import { useForm, zodResolver } from '@mantine/form';
import { trpc } from '../../utils/trpc';
import { IUserActivity, userActivitySchema } from '../../server/validations/userActivity';
import { Exercise } from '@prisma/client';
import WorkoutsTab from './workoutsTab/workoutsTab';
import { Loader, Tabs } from '@mantine/core';
import ExercisesTab from './exercisesTab/exercisesTab';




interface WorkoutMainProps {
  userId: string
}

const WorkoutsMain: FC<WorkoutMainProps> = ({ userId }) => {
  // const {data: exercises, isLoading: exercisesLoading} = trpc.useQuery(['exercises.getAllExercises', {userId: userId}])
  // const {data: workouts, isLoading: workoutsLoading} = trpc.useQuery(['exercises.getUserWorkouts', {userId: userId}])

  // if (exercisesLoading || workoutsLoading) {
  //   return (
  //     <>
  //       <Loader></Loader>
  //       <p>User Main loader</p>
  //     </>
  //   )
  // }

  // TODO: Display all users Workouts
  // Have modals on Create exercise and create workout
  // Display created exercises somewhere for edit aswell
  // add edit to workouts as well

  return (
    <>
      {/* <CreateExercise userId={userId}/>
      {exercises && <CreateWorkout userId={userId} exercises={exercises}/>} */}
      <Tabs defaultValue='workouts'>
        <Tabs.List>
          <Tabs.Tab value='activities' title='Activities'>Activities</Tabs.Tab>
          <Tabs.Tab value='workouts' title='Workouts'>Workouts</Tabs.Tab>
          <Tabs.Tab value='exercises' title='Exercises'>Exercises</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='activities'>Activities</Tabs.Panel>
        <Tabs.Panel value='workouts'>
          <WorkoutsTab userId={userId}/>
        </Tabs.Panel>
        <Tabs.Panel value='exercises'>
          <ExercisesTab userId={userId}/>
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default WorkoutsMain
