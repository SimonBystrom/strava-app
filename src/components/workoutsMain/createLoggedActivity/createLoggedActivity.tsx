import { FC, useCallback, useState, } from 'react'
import { Button, Select } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { ILoggedActivity,  loggedActivitySchema,  } from '../../../server/validations/userActivity';
import { useCreateLoggedActivity } from '../../../hooks/loggedActivity';
import { DatePicker } from '@mantine/dates';
import { Workout } from '@prisma/client';

interface CreateLoggedActivityProps {
  userId: string
  workouts: Pick<Workout, 'name' | 'sets' | 'id'>[]
  onCreateSuccess: () => void
}

const CreateLoggedActivity: FC<CreateLoggedActivityProps> = ({ userId, workouts, onCreateSuccess }) => {
  const { mutateAsync: createLoggedActivity, error } = useCreateLoggedActivity()

  const [pickedDate, setPickedDate] = useState(new Date());
  const form = useForm({
    validate: zodResolver(loggedActivitySchema),
    initialValues: {
      userId,
      workoutId: '',
      date: pickedDate
    }
  })

  console.log('Current form values', form.values)
  const onSubmit = useCallback(
    async (data: ILoggedActivity) => {
      console.log('starting onSubmit')
      const results = await createLoggedActivity(data)
      if (error) {
        console.info('Some error occured... ', error)
      }
      if (results) {
        console.log('---->', results)
        form.reset()
        onCreateSuccess()
      }
    }, [createLoggedActivity, form, error, onCreateSuccess]
  )

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <Select
        label='Exercises'
        placeholder='ex'
        searchable
        clearable
        data={workouts.map(e => ({
          label: e.name,
          value: e.id
        }))}
        {...form.getInputProps('workoutId')}
      />
      <DatePicker
        value={pickedDate}
        onChange={e => setPickedDate(e || new Date())}
        {...form.getInputProps('date')}
      />
      <Button variant='filled' type="submit">
        craete
      </Button>
    </form>
  )
}

export default CreateLoggedActivity
