import create from 'zustand'

export type ActivityTime = {
  hours: number,
  minutes: number,
  seconds: number,
}

export type Activity = {
  type: 'Run' | 'Ride',
  name: string,
  averageSpeed: number,
  distance: number,
  maxSpeed: number,
  startDateLocal: string,
  elapsedTime: ActivityTime,
  movingTime: ActivityTime,
  unparsedTime: number,
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
