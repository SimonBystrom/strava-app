import { Button, TextInput } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { useCallback } from "react"
import { exerciseSchema, IExercises } from "../../../server/validations/userActivity"
import { trpc } from "../../../utils/trpc"

interface CreateExerciseProps {
  userId: string
}
const CreateExercise: React.FC<CreateExerciseProps> = ({ userId }) => {
  const form = useForm({
    validate: zodResolver(exerciseSchema),
    initialValues: {
      name: '',
      reps: '',
      userId: userId,
      description: '',
    }
  })
  const { mutateAsync } = trpc.useMutation(["exercises.createExercise"])

  const onSubmit = useCallback(
    async (data: IExercises) => {
      const results = await mutateAsync(data)
      if (results) {
        form.reset()
      }
    }, [mutateAsync, form]
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
