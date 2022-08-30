import { Button, Drawer, Table } from "@mantine/core"
import { Exercise, Workout } from "@prisma/client"
import { useState } from "react"
import CreateWorkout from "../createWorkout/createWorkout"

interface WorkoutsTabProps {
  workouts: Workout[]
  exercises: Exercise[]
  userId: string
}


const WorkoutsTab: React.FC<WorkoutsTabProps> = ({
  workouts,
  exercises,
  userId,
 }) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

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
