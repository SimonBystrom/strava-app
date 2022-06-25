import { Activity, ActivityTime } from "../stores/userActivitiesStore"
import { convertToHourMinSec } from "../utils/timeConverter"



export type RunningData = {
  total: number,
  time: ActivityTime,
  distance: number,
  twoKM: number,
  fiveKM: number,
  tenKM: number,
  // halfMarathon: number,
  // marathon: number,
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
  const twoKM = filteredData.filter(activity => activity.distance > 2000 && activity.distance < 5000).length
  const fiveKM = filteredData.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
  const tenKM = filteredData.filter(activity => activity.distance > 10000).length
  return {
    total: totalRuns,
    time: totalTime,
    distance: totalDistance,
    twoKM,
    fiveKM,
    tenKM,
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
  const twoKM = filteredData.filter(activity => activity.distance > 2000 && activity.distance < 5000).length
  const fiveKM = filteredData.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
  const tenKM = filteredData.filter(activity => activity.distance > 10000).length
  return {
    total: totalRuns,
    time: totalTime,
    distance: totalDistance,
    twoKM,
    fiveKM,
    tenKM,
  }
}

const getAllActivities = (activities: Activity[]): RunningData => {
  let initialValue = 0
  const totalTime = convertToHourMinSec(activities.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
  const totalDistance = activities.reduce((prev, curr) => prev + curr.distance, initialValue)
  const twoKM = activities.filter(activity => activity.distance > 2000 && activity.distance < 5000).length
  const fiveKM = activities.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
  const tenKM = activities.filter(activity => activity.distance > 10000).length
  return {
    total: activities.length,
    time: totalTime,
    distance: totalDistance,
    twoKM,
    fiveKM,
    tenKM,
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
