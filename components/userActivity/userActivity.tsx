import { FC } from 'react'
import { Activity } from '../../stores/userActivitiesStore'

interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  return (
    <div>
      {activities.map(item => {
        return (
          <span key={item.distance}>{item.distance}</span>
        )
      })}
    </div>
  )
}

export default UserActivity
