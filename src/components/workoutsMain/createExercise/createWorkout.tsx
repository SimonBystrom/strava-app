import { Button, TextInput } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { useCallback } from "react"
import { useCreateExercise } from "../../../hooks/exercises"
import { exerciseSchema, IExercises } from "../../../server/validations/userActivity"

interface CreateExerciseProps {
  userId: string
  onCreateSuccess: () => void
}
const CreateExercise: React.FC<CreateExerciseProps> = ({ userId, onCreateSuccess }) => {
  const{mutateAsync: createExercise, error} = useCreateExercise()

  const form = useForm({
    validate: zodResolver(exerciseSchema),
    initialValues: {
      name: '',
      reps: '',
      userId: userId,
      description: '',
    }
  })

  const onSubmit = useCallback(
    async (data: IExercises) => {
      const results = await createExercise(data)
      if (error) {
        console.info('Some error occured... ', error)
      }
      if (results) {
        form.reset()
        onCreateSuccess()
      }
    }, [createExercise, form, error, onCreateSuccess]
  )

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        label="Exercise name"
        placeholder="ex"
        {...form.getInputProps('name')}
      />
      <TextInput
        label="Reps"
        placeholder="ex"
        {...form.getInputProps('reps')}
      />
      <TextInput
        label="Description"
        placeholder="ex"
        {...form.getInputProps('description')}
      />
      <Button variant='filled' type="submit">
        craete
      </Button>
    </form>
  )
}

export default CreateExercise
