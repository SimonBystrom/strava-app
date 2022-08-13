import { Activity } from "../types/stravaTypes"

export const useAllActivityDates = (activities: Activity[]) => {
  const allDates = activities.map(activity => new Date(activity.startDateLocal.slice(0, -1)))
  return allDates
}
