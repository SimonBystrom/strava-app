import { trpc } from "../utils/trpc"

/**
 * Gives the User's Logged Activities
 */
export const useUserLoggedActivities = (userId: string) => {
  const { data: loggedActivities, isLoading } = trpc.useQuery(['exercises.getUserLoggedActivities', { userId: userId }], {
    staleTime: 300000,
  })

  return {
    loggedActivities: loggedActivities || [],
    isLoading
  }
}

/**
 * Creates a Logged Activity
 */
export const useCreateLoggedActivity = () => {
  const utils = trpc.useContext();

  const { mutateAsync, error } = trpc.useMutation(["exercises.createLoggedActivity"], {
    onSuccess: () => {
      utils.invalidateQueries(['exercises.getUserLoggedActivities'])
    }
  })

  return {
    mutateAsync,
    error
  }
}
