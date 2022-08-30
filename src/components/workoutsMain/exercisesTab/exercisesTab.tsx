import { Button, Drawer, Loader, Table } from "@mantine/core"
import { useState } from "react"
import { useUserExercises } from "../../../hooks/exercises"
import CreateExercise from "../createExercise/createWorkout"

interface ExercisesTabProps {
  userId: string
}


const ExercisesTab: React.FC<ExercisesTabProps> = ({
  userId,
}) => {
  const { exercises, isLoading } = useUserExercises(userId)
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  if(isLoading) {
    return (
      <Loader>
        Loading exercises tab data
      </Loader>
    )
  }

  if (!exercises) {
    return (
      <>
        <p>No Exercises made yet...</p>
        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title='Create Workout'
          padding='xl'
          size='xl'
          position='right'
        >
          <CreateExercise userId={userId} onCreateSuccess={() => setDrawerOpen(false)}/>
        </Drawer>
        <Button onClick={() => setDrawerOpen(true)}>New Exercise</Button>
      </>
    )
  }

  const rows = exercises.map((exercise, idx) => (
    <tr key={`${idx}-${exercise.name}`}>
      <td>{exercise.name}</td>
      <td>{exercise.reps}</td>
      <td>{exercise.description}</td>
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
        <CreateExercise userId={userId} onCreateSuccess={() => setDrawerOpen(false)}/>
      </Drawer>
      <Button onClick={() => setDrawerOpen(true)}>New Exercise</Button>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Reps</th>
            <th>Description</th>
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

export default ExercisesTab
