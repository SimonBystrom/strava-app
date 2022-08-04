import { Activity, ActivityTime } from "../stores/userActivitiesStore"
import { convertToHourMinSec } from "../utils/timeConverter"

export enum TimePeriod {
  Month = 'month',
  Year = 'year',
  All = 'all',
  Custom = 'custom'
}

export type RunningData = {
  total: number,
  time: ActivityTime,
  distance: number,
  oneKM: number,
  twoKM: number,
  threeKM: number,
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
  const oneKM =
    filteredData.filter(activity => activity.distance > 1000 && activity.distance < 2000).length
    const twoKM =
      filteredData.filter(activity => activity.distance > 2000 && activity.distance < 3000).length
  const threeKM =
    filteredData.filter(activity => activity.distance > 3000 && activity.distance < 5000).length
    const fiveKM =
      filteredData.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
    const tenKM =
      filteredData.filter(activity => activity.distance > 10000).length
    return {
      total: totalRuns,
      time: totalTime,
      distance: totalDistance,
      oneKM,
      twoKM,
      threeKM,
      fiveKM,
      tenKM,
    }
}

// I could make the custom period part of the getActivitiesByPeriod function, but it would require me to
// also make the return type a union of RunningData | null -> and then the useRunsByPeriod return data all
// has to be optional -> less predictability of the data returns that should always have data.
// Might have to rethink this logic in the future. (What if a signed in user has no runs? What is the structure
// of the activities array then?)
const getCustomPeriod = (
  activities: Activity[],
  customPeriod: [Date | null, Date | null]
): RunningData | null => {

  if (customPeriod && customPeriod.every(index => index !== null)) {
    const filteredData = activities.filter(activity => {
      const activityDate = new Date(activity.startDateLocal.slice(0, -1))
      return (activityDate > customPeriod[0]! && activityDate < customPeriod[1]!)
    })
    // TODO: Clean up and make helper functions -> More dry
    let initialValue = 0
    const totalRuns = filteredData.length
    const totalTime =
      convertToHourMinSec(filteredData.reduce((prev, curr) => prev + curr.unparsedTime, initialValue))
    const totalDistance =
      filteredData.reduce((prev, curr) => prev + curr.distance, initialValue)
    const oneKM =
      filteredData.filter(activity => activity.distance > 1000 && activity.distance < 2000).length
    const twoKM =
      filteredData.filter(activity => activity.distance > 2000 && activity.distance < 3000).length
    const threeKM =
      filteredData.filter(activity => activity.distance > 3000 && activity.distance < 5000).length
    const fiveKM =
      filteredData.filter(activity => activity.distance > 5000 && activity.distance < 10000).length
    const tenKM =
      filteredData.filter(activity => activity.distance > 10000).length
    return {
      total: totalRuns,
      time: totalTime,
      distance: totalDistance,
      oneKM,
      twoKM,
      threeKM,
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
