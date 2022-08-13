import { ActivityTime } from "../types/stravaTypes"


export const convertToHourMinSec = (totalSec: number): ActivityTime => {
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor(totalSec % 3600 / 60)
  const seconds = Math.floor(totalSec % 3600 % 60)

  return {
    hours,
    minutes,
    seconds,
  }
}
