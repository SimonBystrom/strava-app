import { Calendar } from '@mantine/dates'
import { LoggedActivity, Workout } from '@prisma/client'
import dayjs from 'dayjs'
import {FC, useState} from 'react'
import { useAllStravaActivityDates, useAllWorkoutDates } from '../../../../hooks/allActivityDates'
import { useRunsByPeriod } from '../../../../hooks/runsByPeriod'
import { Activity } from '../../../../types/stravaTypes'
import CustomTimeRangeData from '../customTimeRangeData/customTimeRangeData'
import TimePeriodData from '../timePeriodData/timePeriodData'
import classes from './timeLine.module.scss'

interface TimeLineProps {
  stravaActivities: Activity[]
  loggedWorkouts: (LoggedActivity & { workout: Workout })[]
  customPeriod: [Date | null, Date | null]
  setCustomPeriod: (dates: [Date | null, Date | null]) => void
}

const TimeLine: FC<TimeLineProps> = ({
  stravaActivities,
  customPeriod,
  setCustomPeriod,
  loggedWorkouts,
}) => {
  const allStravaDates = useAllStravaActivityDates(stravaActivities)
  const allWorkoutDates = useAllWorkoutDates(loggedWorkouts)
  // const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(stravaActivities, customPeriod)
  const currentTime = new Date()

  return (
    <div className={classes.ActivityGridWrapper}>
      <div className={classes.TimeLineDataContainer}>
        <TimePeriodData label={dayjs(currentTime).format('MMMM')} period={month} />
        <TimePeriodData label={dayjs(currentTime).format('YYYY')} period={year} />
        <TimePeriodData label='All Time' period={all} />
      </div>
      <div className={classes.Calendar}>
        <Calendar
          onChange={() => { }}
          dayStyle={(date) => {
            date.toISOString().slice(0, -1)
            const dateMatchStrava = allStravaDates.some(activityDate => {
              return (activityDate.getFullYear() === date.getFullYear()) && (activityDate.getMonth() === date.getMonth()) && (activityDate.getDate() === date.getDate())
            })
            const dateMatchWorkout = allWorkoutDates.some( activityDate => {
              return (activityDate.getFullYear() === date.getFullYear()) && (activityDate.getMonth() === date.getMonth()) && (activityDate.getDate() === date.getDate())
            })
            if (dateMatchStrava) {
              return {
                backgroundColor: 'red',
                borderRadius: '50%',
                color: 'white',
                opacity: '0.8',
                transform: 'scale(0.8)',
                fontSize: '16px',
              }
            }
            if (dateMatchWorkout) {
              return {
                backgroundColor: 'blue',
                borderRadius: '50%',
                color: 'white',
                opacity: '0.8',
                transform: 'scale(0.8)',
                fontSize: '16px',
              }
            }
            return {}
          }}
        />
      </div>
      <CustomTimeRangeData
        label='Custom Range'
        period={custom}
        customPeriod={customPeriod}
        setCustomPeriod={setCustomPeriod}
      />
    </div>
  )
}
export default TimeLine
