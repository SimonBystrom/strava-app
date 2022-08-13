import { Loader} from '@mantine/core'
import { FC } from 'react'
import { useAthleteActivities } from '../../hooks/athleteActivities'
import Activities from './userActivity/activities/activites'
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection'
import { Activity } from '../../types/stravaTypes'


interface UserActivityProps {
  athleteActivities: Activity[]
}

export const UserActivity: FC<UserActivityProps> = ({ athleteActivities }) => {
  return (
    <Activities activities={athleteActivities}/>
  )
}


interface ActivityMainProps {
  userId: string
}

const ActivityMain: FC<ActivityMainProps> = ({userId}) => {
  const { isLoading, data: athleteActivities } = useAthleteActivities(userId)

  if (isLoading) {
    return (
      <>
        <Loader size="xl" />
        <p>Activity Main loader</p>
      </>
    )
  }
  if (!athleteActivities) {
    return <ConnectToStrava userId={userId}/>
  }
  return (
    <UserActivity athleteActivities={athleteActivities} />
  )
}

export default ActivityMain
