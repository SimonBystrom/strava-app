export const convertToHourMinSec = (totalSec: number): {
  hours: number,
  minutes: number,
  seconds: number
} => {
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor(totalSec % 3600 / 60)
  const seconds = Math.floor(totalSec % 3600 % 60)

  return {
    hours,
    minutes,
    seconds,
  }
}
