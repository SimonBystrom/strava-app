import { trpc } from "../utils/trpc"

/**
 * Gives the User's Workouts
 */
export const useUserWorkouts = (userId: string) => {
  const { data: workouts, isLoading } = trpc.useQuery(['exercises.getUserWorkouts', { userId: userId }], {
    staleTime: 300000,
  })

  return {
    workouts: workouts ||  [],
    isLoading
  }
}

/**
 * Creates a Workout
 */
export const useCreateWorkout = () => {
  const utils = trpc.useContext();

  const { mutateAsync, error } = trpc.useMutation(["exercises.createWorkout"], {
    onSuccess: () => {
      utils.invalidateQueries(['exercises.getUserWorkouts'])
    }
  })

  return {
    mutateAsync,
    error
  }
}
