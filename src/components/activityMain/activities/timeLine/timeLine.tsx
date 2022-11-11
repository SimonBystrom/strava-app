import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'
import {FC, useState} from 'react'
import { useAllActivityDates } from '../../../../hooks/allActivityDates'
import { useRunsByPeriod } from '../../../../hooks/runsByPeriod'
import { Activity } from '../../../../types/stravaTypes'
import CustomTimeRangeData from '../customTimeRangeData/customTimeRangeData'
import TimePeriodData from '../timePeriodData/timePeriodData'
import classes from './timeLine.module.scss'

interface TimeLineProps {
  activities: Activity[]
  customPeriod: [Date | null, Date | null]
  setCustomPeriod: (dates: [Date | null, Date | null]) => void
}

const TimeLine: FC<TimeLineProps> = ({activities, customPeriod, setCustomPeriod}) => {
  const allDates = useAllActivityDates(activities)
  // const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const currentTime = new Date()

  return (
    <div className={classes.ActivityGridWrapper}>
      <div className={classes.TimeLineDataContainer}>
        <TimePeriodData label={dayjs(currentTime).format('MMMM')} period={month} />
        {/* <TimePeriodData label={dayjs(currentTime).format('YYYY')} period={year} /> */}
        {/* <TimePeriodData label='All Time' period={all} /> */}
      </div>
      {/* <div className={classes.Calendar}>
        <Calendar
          onChange={() => { }}
          dayStyle={(date) => {
            date.toISOString().slice(0, -1)
            const dateMatch = allDates.some(activityDate => {
              return (activityDate.getFullYear() === date.getFullYear()) && (activityDate.getMonth() === date.getMonth()) && (activityDate.getDate() === date.getDate())
            })
            if (dateMatch) {
              return {
                backgroundColor: 'red',
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
      </div> */}
      {/* <CustomTimeRangeData
        label='Custom Range'
        period={custom}
        customPeriod={customPeriod}
        setCustomPeriod={setCustomPeriod}
      /> */}
    </div>
  )
}
export default TimeLine
