import { Button, Drawer, Loader, Table } from "@mantine/core"
import { Workout } from "@prisma/client"
import dayjs from "dayjs"
import { useState } from "react"
import { useAllExercises } from "../../../hooks/exercises"
import { useUserLoggedActivities } from "../../../hooks/loggedActivity"
import { useUserWorkouts } from "../../../hooks/workouts"
import CreateLoggedActivity from "../createLoggedActivity/createLoggedActivity"
import CreateWorkout from "../createWorkout/createWorkout"

interface LoggedActivityProps {
  userId: string
}


const LoggedActivity: React.FC<LoggedActivityProps> = ({
  userId,
}) => {

  const { workouts, isLoading: workoutsLoading } = useUserWorkouts(userId)
  const { loggedActivities, isLoading: loggedActivitiesLoading } = useUserLoggedActivities(userId)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  if (loggedActivitiesLoading || workoutsLoading) {
    return (
      <>
        <Loader></Loader>
        <p>Workouts tab loader loader</p>
      </>
    )
  }
  const parsedWorkouts: Pick<Workout, 'name' | 'sets' | 'id'>[] = workouts.map(workout => ({
    id: workout.id,
    name: workout.name,
    sets: workout.sets,
  }))
  if (loggedActivities.length === 0) {
    return (
      <>
        <p>No Logged activity made yet...</p>
        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title='Create Logged Activity'
          padding='xl'
          size='xl'
          position='right'
        >
          <CreateLoggedActivity userId={userId} workouts={parsedWorkouts} onCreateSuccess={() => setDrawerOpen(false)} />
        </Drawer>
        <Button onClick={() => setDrawerOpen(true)}>New Logged Activity</Button>
      </>
    )
  }
  console.log('--->', workouts)

  const rows = loggedActivities.map((activity, idx) => (
    <tr key={`${idx}-${activity.workout.name}`}>
      <td>{activity.workout.name}</td>
      <td>{activity.workout.sets}</td>
      <td>{dayjs(activity.date).format('MMMM D, YYYY')}</td>
      <td>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </td>
    </tr>
  ))

  return (
    <div>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title='Create Workout'
        padding='xl'
        size='xl'
        position='right'
      >
        {/* <CreateWorkout userId={userId} exercises={exercises} onCreateSuccess={() => setDrawerOpen(false)} /> */}
      </Drawer>
      <Button onClick={() => setDrawerOpen(true)}>New Workout</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sets</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    </div>
  )
}

export default LoggedActivity
