import { FC } from 'react'
import { Activity } from '../../stores/userActivitiesStore'

interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  return (
    <>

      <h2>ACTIVITIES</h2>
      {activities.map(item => {
        return (
          <div key={item.distance}>{item.distance}</div>
        )
      })}
    </>
  )
}

export default UserActivity
