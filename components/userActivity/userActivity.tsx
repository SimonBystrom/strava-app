import { Select } from '@mantine/core'
import classNames from 'classnames'
import { FC, useState } from 'react'
import { RunningData, useRunsByPeriod } from '../../hooks/runsByPeriod'
import { Activity } from '../../stores/userActivitiesStore'
import { convertToKm } from '../../utils/distanceConverter'
import classes from './userActivity.module.scss'


enum TimePeriods {
  Month = 'month',
  Year = 'year',
  All = 'all'
}
interface MilestonesProps {
  periodData: RunningData
}

const Milestones: FC<MilestonesProps> = ({periodData}) => {
    return (
      <>
        <div>2KM: {periodData.twoKM}</div>
        <div>5KM: {periodData.fiveKM}</div>
        <div>10KM: {periodData.tenKM}</div>
      </>
    )
}

interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  const {month,  year, all} = useRunsByPeriod(activities)
  const [milestonePeriod, setMilestonePeriod] = useState<string | null>(TimePeriods.All)
  convertToKm(month.distance)
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
      </div>
      <div>
        <h2>MILESTONES</h2>
        <Select
          label='Select time period'
          placeholder='Select time period'
          data={[
            { value: TimePeriods.Month, label: 'This month' },
            { value: TimePeriods.Year, label: 'This year' },
            { value: TimePeriods.All, label: 'All Time' }
          ]}
          value={milestonePeriod}
          onChange={setMilestonePeriod}
        />
        {milestonePeriod === TimePeriods.Month && <Milestones periodData={month}/>}
        {milestonePeriod === TimePeriods.Year && <Milestones periodData={year}/>}
        {milestonePeriod === TimePeriods.All && <Milestones periodData={all}/>}
      </div>
    </div>
  )
}

export default UserActivity
