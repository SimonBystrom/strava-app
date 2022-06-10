import create from 'zustand'
import { ActivityTime } from "../stores/userActivitiesStore"

export type BaseStats = {
  count: number,
  distance: number,
  elapsedTime: ActivityTime,
  elevationGain: number,
  movingTime: ActivityTime,
}

const emptyRunningStats: BaseStats = {
  count: 0,
  distance: 0,
  elapsedTime: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  },
  elevationGain: 0,
  movingTime: {
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
}

type UserStatsStoreProps = {
  runningStats: BaseStats,
  setRunningStats: (runningStats: BaseStats) => void,
}

export const useUserStatsStore = create<UserStatsStoreProps>(
  (set => ({
    runningStats: emptyRunningStats,
    setRunningStats: runningStats => set({ runningStats })
  }))
)
