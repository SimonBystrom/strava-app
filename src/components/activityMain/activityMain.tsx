import { Loader} from '@mantine/core'
import { FC } from 'react'
import { useAthleteActivities } from '../../hooks/athleteActivities'
import Activities from './userActivity/activities/activites'
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection'

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
    <Activities activities={athleteActivities.res} userId={userId}/>
  )
}

export default ActivityMain
