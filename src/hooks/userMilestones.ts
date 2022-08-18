import { trpc } from "../utils/trpc"

export const useUserMilestones = (userId: string) => {
  const {data: userMilestones, isLoading} = trpc.useQuery(['userMilestones.getMilestones', {id: userId}])
  return {
    data: userMilestones || [],
    isLoading
  }
}
