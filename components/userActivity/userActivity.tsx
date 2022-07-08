import { Select } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { useRunsByPeriod } from '../../hooks/runsByPeriod'
import { Activity } from '../../stores/userActivitiesStore'
import classes from './userActivity.module.scss'
import { useAllActivityDates } from '../../hooks/allActivityDates'
import TimePeriodData from './timePeriodData/timePeriodData'
import CustomTimeRangeData from './customTimeRangeData/customTimeRangeData'


export enum TimePeriod {
  Month = 'month',
  Year = 'year',
  All = 'all',
  Custom = 'custom'
}
interface MilestonesProps {
  period: TimePeriod
  activities: Activity[]
  customPeriod: [Date | null, Date | null]
}

const Milestones: FC<MilestonesProps> = ({period, activities, customPeriod}) => {
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  switch (period) {
    case TimePeriod.Month:
      return (
        <>
          <div>2KM: {month.twoKM}</div>
          <div>5KM: {month.fiveKM}</div>
          <div>10KM: {month.tenKM}</div>
        </>
      )
    case TimePeriod.Year:
      return (
        <>
          <div>2KM: {year.twoKM}</div>
          <div>5KM: {year.fiveKM}</div>
          <div>10KM: {year.tenKM}</div>
        </>
      )
    case TimePeriod.All:
      return (
        <>
          <div>2KM: {all.twoKM}</div>
          <div>5KM: {all.fiveKM}</div>
          <div>10KM: {all.tenKM}</div>
        </>
      )
    case TimePeriod.Custom:
      return (
        <>
        { custom &&
          <>
            <div>2KM: {custom.twoKM}</div>
            <div>5KM: {custom.fiveKM}</div>
            <div>10KM: {custom.tenKM}</div>
          </>
        }
        </>

      )
    default:
      return <></>
  }
}

interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  const [milestonePeriod, setMilestonePeriod] = useState<string | null>(TimePeriod.All)
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const allDates = useAllActivityDates(activities)
  const currentTime = new Date()
  // TODO: Refactor the 'Activities' List into it's own component
  return (
    <div className={classes.ActivitesPageWrapper}>
      <div className={classes.ActivitiesContainer}>
        <h2>ACTIVITIES</h2>
        <div className={classes.ActivityGridWrapper}>
          <div className={classes.TimeLineDataContainer}>
            <TimePeriodData label={dayjs(currentTime).format('MMMM')} period={month}/>
            <TimePeriodData label={dayjs(currentTime).format('YYYY')} period={year}/>
            <TimePeriodData label='All Time' period={all}/>
          </div>
          <div className={classes.Calendar}>
            <Calendar dayStyle={(date) => {
              date.toISOString().slice(0, -1)
              const dateMatch = allDates.some(activityDate => {
                return (activityDate.getFullYear() === date.getFullYear()) && (activityDate.getMonth() === date.getMonth()) && (activityDate.getDate() === date.getDate())
              })
              if (dateMatch){
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
            }}/>
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
        <Select
          label='Select time period'
          placeholder='Select time period'
          data={[
            { value: TimePeriod.Month, label: 'This month' },
            { value: TimePeriod.Year, label: 'This year' },
            { value: TimePeriod.All, label: 'All Time' },
            { value: TimePeriod.Custom, label: 'Custom' }
          ]}
          value={milestonePeriod}
          onChange={setMilestonePeriod}
        />
        <Milestones period={milestonePeriod as TimePeriod} activities={activities} customPeriod={customPeriod}/>
      </div>
      <div className={classes.GoalsContainer}>
      </div>
    </div>
  )
}

export default UserActivity
