import { FC, useCallback, } from 'react'
import { Button, MultiSelect, NumberInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Exercise } from '@prisma/client';
import { IUserActivity, userActivitySchema } from '../../../server/validations/userActivity';
import { trpc } from '../../../utils/trpc';
import { useCreateWorkout } from '../../../hooks/workouts';

interface CreateWorkoutProps {
  userId: string
  exercises: Exercise[]
  onCreateSuccess: () => void
}

const CreateWorkout: FC<CreateWorkoutProps> = ({ userId, exercises, onCreateSuccess }) => {
  const {mutateAsync: createWorkout, error} = useCreateWorkout()
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


  const onSubmit = useCallback(
    async (data: IUserActivity) => {
      const results = await createWorkout(data)
      if(error) {
        console.info('Some error occured... ', error)
      }
      if (results) {
        console.log('---->', results)
        form.reset()
        onCreateSuccess()
      }
    }, [createWorkout, form, error, onCreateSuccess]
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

export default CreateWorkout
