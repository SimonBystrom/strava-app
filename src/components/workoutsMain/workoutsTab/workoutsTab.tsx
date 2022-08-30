import { Button, Drawer, Loader, Table } from "@mantine/core"
import { Exercise, Workout } from "@prisma/client"
import { useState } from "react"
import { trpc } from "../../../utils/trpc"
import CreateWorkout from "../createWorkout/createWorkout"

interface WorkoutsTabProps {
  // workouts: Workout[]
  // exercises: Exercise[]
  userId: string
}


const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  // workouts,
  // exercises,
  userId,
 }) => {
  const { data: exercises, isLoading: exercisesLoading } = trpc.useQuery(['exercises.getAllExercises', { userId: userId }])
  const { data: workouts, isLoading: workoutsLoading } = trpc.useQuery(['exercises.getUserWorkouts', { userId: userId }])
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  if (exercisesLoading || workoutsLoading) {
    return (
      <>
        <Loader></Loader>
        <p>Workouts tab loader loader</p>
      </>
    )
  }

  if (!exercises) {
    return (
      <>
        <p>No Exercises made yet... = Cant make workout</p>
      </>
    )
  }

  if (!workouts) {
    return (
      <>
        <p>No Workouts made yet...</p>
        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title='Create Workout'
          padding='xl'
          size='xl'
          position='right'
        >
          <CreateWorkout userId={userId} exercises={exercises} />
        </Drawer>
        <Button onClick={() => setDrawerOpen(true)}>New Workout</Button>
      </>
    )
  }

  const rows = workouts.map((workout, idx) => (
    <tr key={`${idx}-${workout.name}`}>
      <td>{workout.name}</td>
      <td>{workout.sets}</td>
      <td>Exercises ... (todo)</td>
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
        <CreateWorkout userId={userId} exercises={exercises}/>
      </Drawer>
      <Button onClick={() => setDrawerOpen(true)}>New Workout</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sets</th>
            <th>Exercises</th>
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

export default WorkoutsTab
