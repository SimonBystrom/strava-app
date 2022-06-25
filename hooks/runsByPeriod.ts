import { TimePeriod } from "../components/userActivity/userActivity"
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

const getActivitiesByPeriod = (
  activities: Activity[],
  currentDate: Date,
  period?: TimePeriod
  ): RunningData => {

    let filteredData
    switch (period) {
      case TimePeriod.Month:
        filteredData = activities.filter(activity => {
          const activityDate = new Date(activity.startDateLocal.slice(0, -1))
          return (activityDate.getMonth() === currentDate.getMonth()) && (activityDate.getFullYear() === currentDate.getFullYear())
        })
      break
      case TimePeriod.Year:
        filteredData = activities.filter(activity => {
          const activityDate = new Date(activity.startDateLocal.slice(0, -1))
          return activityDate.getFullYear() === currentDate.getFullYear()
        })
      break
      default:
        filteredData = activities
        break;
    }

    let initialValue = 0
    const totalRuns = filteredData.length
    const totalTime =
      convertToHourMinSec(filteredData.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
    const totalDistance =
      filteredData.reduce((prev, curr) => prev + curr.distance, initialValue)
    const twoKM =
      filteredData.filter(activity => activity.distance > 2000 && activity.distance < 5000).length
    const fiveKM =
      filteredData.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
    const tenKM =
      filteredData.filter(activity => activity.distance > 10000).length
    return {
      total: totalRuns,
      time: totalTime,
      distance: totalDistance,
      twoKM,
      fiveKM,
      tenKM,
    }
}

const getCustomPeriod = (
  activities: Activity[],
  customPeriod: [Date | null, Date | null]
): RunningData | null => {

  if (customPeriod && customPeriod.every(index => index !== null)) {
    const filteredData = activities.filter(activity => {
      const activityDate = new Date(activity.startDateLocal.slice(0, -1))
      return (activityDate > customPeriod[0]! && activityDate < customPeriod[1]!)
    })
    let initialValue = 0
    const totalRuns = filteredData.length
    const totalTime =
      convertToHourMinSec(filteredData.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
    const totalDistance =
      filteredData.reduce((prev, curr) => prev + curr.distance, initialValue)
    const twoKM =
      filteredData.filter(activity => activity.distance > 2000 && activity.distance < 5000).length
    const fiveKM =
      filteredData.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
    const tenKM =
      filteredData.filter(activity => activity.distance > 10000).length
    return {
      total: totalRuns,
      time: totalTime,
      distance: totalDistance,
      twoKM,
      fiveKM,
      tenKM,
    }
  }
  return null
}



type RunsByPeriod = {
  month: RunningData,
  year: RunningData,
  all: RunningData,
  custom?: RunningData | null,
}

/**
 * Returns the Year, Month, All data for user running activity.
 * Year / Month / All has data for Total Time / Total Distance / Total Runs
 */
export const useRunsByPeriod = (activities: Activity[], customPeriod?: [Date | null, Date | null]): RunsByPeriod => {
  let currentDate = new Date()
  const month = getActivitiesByPeriod(activities, currentDate, TimePeriod.Month)
  const year = getActivitiesByPeriod(activities, currentDate, TimePeriod.Year)
  const all = getActivitiesByPeriod(activities, currentDate)
  const custom = customPeriod && getCustomPeriod(activities, customPeriod)

  return {
    month,
    year,
    all,
    custom,
  }
}
