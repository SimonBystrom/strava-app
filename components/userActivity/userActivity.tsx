import { FC } from 'react'
import { useRunsByPeriod } from '../../hooks/runsByPeriod'
import { Activity } from '../../stores/userActivitiesStore'
import { convertToKm } from '../../utils/distanceConverter'



interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  const {month,  year, all} = useRunsByPeriod(activities)
  convertToKm(month.distance)
  return (
    <>
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
    </>
  )
}

export default UserActivity
