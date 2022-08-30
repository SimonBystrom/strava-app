import { trpc } from "../utils/trpc"

/**
 * Gives the User's Exercises
 */
export const useUserExercises = (userId: string) => {
  const { data: exercises, isLoading } = trpc.useQuery(['exercises.getUserExercises', { userId: userId }], {
    staleTime: 300000,
  })

  return {
    exercises: exercises || [],
    isLoading
  }
}

/**
 * Gives All Exercises
 */
export const useAllExercises = (userId: string) => {
    const { data: exercises, isLoading } = trpc.useQuery(['exercises.getAllExercises', { userId: userId }], {
      staleTime: 300000,
    })

    return {
      exercises: exercises || [],
      isLoading
    }
}

/**
 * Creates an Exercise
 */
export const useCreateExercise = () => {
  const utils = trpc.useContext();

  const { mutateAsync, error } = trpc.useMutation(["exercises.createExercise"], {
    onSuccess: () => {
      utils.invalidateQueries(['exercises.getAllExercises'])
      utils.invalidateQueries(['exercises.getUserExercises'])
    }
  })

  return {
    mutateAsync,
    error
  }
}
