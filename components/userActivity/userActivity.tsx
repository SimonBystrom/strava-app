import { Select } from '@mantine/core'
import { DateRangePicker } from '@mantine/dates'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { RunningData, useRunsByPeriod } from '../../hooks/runsByPeriod'
import { Activity } from '../../stores/userActivitiesStore'
import { convertToKm } from '../../utils/distanceConverter'
import classes from './userActivity.module.scss'


export enum TimePeriod {
  Month = 'month',
  Year = 'year',
  All = 'all'
}
interface MilestonesProps {
  period: TimePeriod
  activities: Activity[]
}

const Milestones: FC<MilestonesProps> = ({period, activities}) => {
  const { month, year, all } = useRunsByPeriod(activities)
  if(period === TimePeriod.Month) {
    return (
      <>
        <div>2KM: {month.twoKM}</div>
        <div>5KM: {month.fiveKM}</div>
        <div>10KM: {month.tenKM}</div>
      </>
    )
  }
  if (period === TimePeriod.Year) {
    return (
      <>
        <div>2KM: {year.twoKM}</div>
        <div>5KM: {year.fiveKM}</div>
        <div>10KM: {year.tenKM}</div>
      </>
    )
  }
  if (period === TimePeriod.All) {
    return (
      <>
        <div>2KM: {all.twoKM}</div>
        <div>5KM: {all.fiveKM}</div>
        <div>10KM: {all.tenKM}</div>
      </>
    )
  }
  return (<></>)
}

interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  const [milestonePeriod, setMilestonePeriod] = useState<string | null>(TimePeriod.All)
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  console.log(custom)
  return (
    <div className={classes.ActivitiesContainer}>
      <div >
        <h2>ACTIVITIES</h2>
        <div>
          <h4>This month</h4>
          <p>Total: {month.total}</p>
          <p>Distance: {convertToKm(month.distance)} km</p>
          <p>Time: {month.time.hours}:{month.time.minutes}:{month.time.seconds} </p>
        </div>
        <div>
          <h4>This year</h4>
          <p>Total: {year.total}</p>
          <p>Distance: {convertToKm(year.distance)} km</p>
          <p>Time: {year.time.hours}:{year.time.minutes}:{year.time.seconds} </p>
        </div>
        <div>
          <h4>All time</h4>
          <p>Total: {all.total}</p>
          <p>Distance: {convertToKm(all.distance)} km</p>
          <p>Time: {all.time.hours}:{all.time.minutes}:{all.time.seconds} </p>
        </div>
        <div>
          <h4>Custom range</h4>
          <DateRangePicker
            label='custom date range'
            placeholder='Pick custom range'
            value={customPeriod}
            onChange={setCustomPeriod}
          />
          {custom &&
            <>
            <p>Total: {custom.total}</p>
            <p>Distance: {convertToKm(custom.distance)} km</p>
            <p>Time: {custom.time.hours}:{custom.time.minutes}:{custom.time.seconds} </p>
            </>
          }
        </div>
      </div>
      <div>
        <h2>MILESTONES</h2>
        <Select
          label='Select time period'
          placeholder='Select time period'
          data={[
            { value: TimePeriod.Month, label: 'This month' },
            { value: TimePeriod.Year, label: 'This year' },
            { value: TimePeriod.All, label: 'All Time' }
          ]}
          value={milestonePeriod}
          onChange={setMilestonePeriod}
        />
        <Milestones period={milestonePeriod as TimePeriod} activities={activities}/>
      </div>
    </div>
  )
}

export default UserActivity
