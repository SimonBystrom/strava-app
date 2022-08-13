import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'
import {FC, useState} from 'react'
import { useAllActivityDates } from '../../../../hooks/allActivityDates'
import { useRunsByPeriod } from '../../../../hooks/runsByPeriod'
import { Activity } from '../../../../types/stravaTypes'
import CustomTimeRangeData from '../customTimeRangeData/customTimeRangeData'
import Milestones from '../milestonesData/milestones'
import TimePeriodData from '../timePeriodData/timePeriodData'
import classes from './activities.module.scss'

interface ActivitiesProps {
  activities: Activity[]
}
const Activities: FC<ActivitiesProps> = ({ activities }) => {
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const allDates = useAllActivityDates(activities)
  const currentTime = new Date()

  return (
    <div className={classes.ActivitesPageWrapper}>
      <div className={classes.ActivitiesContainer}>
        <h2>ACTIVITIES</h2>
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
          </div>
          <CustomTimeRangeData
            label='Custom Range'
            period={custom}
            customPeriod={customPeriod}
            setCustomPeriod={setCustomPeriod}
          />
        </div>
      </div>
      <div className={classes.MilestonesContainer}>
        <h2>MILESTONES</h2>
        <Milestones activities={activities} customPeriod={customPeriod} />
      </div>
      <div className={classes.GoalsContainer}>
        <h2>GOALS</h2>
        <p>Show goals and progress</p>
      </div>
    </div>
  )
}

export default Activities
