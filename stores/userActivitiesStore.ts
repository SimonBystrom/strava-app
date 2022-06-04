import create from 'zustand'

type ActivityTime = {
  hours: number,
  minutes: number,
  seconds: number,
}

export type Activity = {
  averageSpeed: number,
  distance: number,
  elapsed_time: ActivityTime,
  moving_time: ActivityTime,
  max_speed: number,
  name: string,
  start_date_local: string,
  type: 'Run' | 'Ride',
}

type UserActivitiesStoreProps = {
  activities: Activity[],
  setActivities: (activities: Activity[]) => void,
}

export const useUserActivitiesStore = create<UserActivitiesStoreProps>(
  (set => ({
    activities: [],
    setActivities: activities => set({ activities })
  }))
)
