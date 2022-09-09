import { FC } from 'react'
import classes from './workoutsMain.module.scss'
import WorkoutsTab from './workoutsTab/workoutsTab';
import {  Tabs } from '@mantine/core';
import ExercisesTab from './exercisesTab/exercisesTab';
import LoggedActivity from './loggedActivityTab/loggedActivityTab';




interface WorkoutMainProps {
  userId: string
}

const WorkoutsMain: FC<WorkoutMainProps> = ({ userId }) => {
  return (
    <>
      <Tabs defaultValue='workouts'>
        <Tabs.List>
          <Tabs.Tab value='activities' title='Activities'>Logged Activities</Tabs.Tab>
          <Tabs.Tab value='workouts' title='Workouts'>Workouts</Tabs.Tab>
          <Tabs.Tab value='exercises' title='Exercises'>Exercises</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value='activities'>
          <LoggedActivity userId={userId} />
        </Tabs.Panel>
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
