import { FC, useCallback, } from 'react'
import { Button, MultiSelect, NumberInput, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Exercise } from '@prisma/client';
import { IUserActivity, userActivitySchema } from '../../../server/validations/userActivity';
import { trpc } from '../../../utils/trpc';

interface CreateWorkoutProps {
  userId: string
  exercises: Exercise[]
}

const CreateWorkout: FC<CreateWorkoutProps> = ({ userId, exercises }) => {

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

export default CreateWorkout
