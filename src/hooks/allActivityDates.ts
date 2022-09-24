import { LoggedActivity, Workout } from "@prisma/client"
import { Activity } from "../types/stravaTypes"

export const useAllStravaActivityDates = (activities: Activity[]) => {
  const allDates = activities.map(activity => new Date(activity.startDateLocal.slice(0, -1)))
  return allDates
}

export const useAllWorkoutDates = (loggedActivity: (LoggedActivity & { workout: Workout })[]) => {
  const allDates = loggedActivity.map(loggedActivity => new Date(loggedActivity.date))
  return allDates
}
