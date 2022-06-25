import { Activity, ActivityTime } from "../stores/userActivitiesStore"
import { convertToHourMinSec } from "../utils/timeConverter"

// export enum TimePeriods {
//   Month = 'month',
//   Year = 'year',
//   All = 'all'
// }

type RunningData = {
  total: number,
  time: ActivityTime,
  distance: number
}

const getMonthActivities = (activities: Activity[], currentDate: Date): RunningData => {
  const filteredData =  activities.filter(activity => {
    const activityDate = new Date(activity.startDateLocal.slice(0, -1))
    return (activityDate.getMonth() === currentDate.getMonth()) && (activityDate.getFullYear() === currentDate.getFullYear())
  })
  let initialValue = 0
  const totalRuns = filteredData.length
  const totalTime = convertToHourMinSec(filteredData.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
  const totalDistance = filteredData.reduce((prev, curr) => prev + curr.distance, initialValue)
  return {
    total: totalRuns,
    time: totalTime,
    distance: totalDistance,
  }
}

const getYearActivities = (activities: Activity[], currentDate: Date): RunningData => {
  const filteredData =  activities.filter(activity => {
    const activityDate = new Date(activity.startDateLocal.slice(0, -1))
    return activityDate.getFullYear() === currentDate.getFullYear()
  })
  let initialValue = 0
  const totalRuns = filteredData.length
  const totalTime = convertToHourMinSec(filteredData.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
  const totalDistance = filteredData.reduce((prev, curr) => prev + curr.distance, initialValue)
  return {
    total: totalRuns,
    time: totalTime,
    distance: totalDistance,
  }
}

const getAllActivities = (activities: Activity[]): RunningData => {
  let initialValue = 0
  const totalTime = convertToHourMinSec(activities.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
  const totalDistance = activities.reduce((prev, curr) => prev + curr.distance, initialValue)
  return {
    total: activities.length,
    time: totalTime,
    distance: totalDistance
  }
}



type RunsByPeriod = {
  month: RunningData,
  year: RunningData,
  all: RunningData
}

/**
 * Returns the Year, Month, All data for user running activity.
 * Year / Month / All has data for Total Time / Total Distance / Total Runs
 */
export const useRunsByPeriod = (activities: Activity[]): RunsByPeriod => {
  let currentDate = new Date()
  const month = getMonthActivities(activities, currentDate)
  const year = getYearActivities(activities, currentDate)
  const all = getAllActivities(activities)

  return {
    month,
    year,
    all,
  }
}
