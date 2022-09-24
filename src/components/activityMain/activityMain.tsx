import { Loader} from '@mantine/core'
import { FC } from 'react'
import { useAthleteActivities } from '../../hooks/athleteActivities'
import Activities from './activities/activites'
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection'
import { useUserLoggedActivities } from '../../hooks/loggedActivity'

interface ActivityMainProps {
  userId: string
}

const ActivityMain: FC<ActivityMainProps> = ({userId}) => {
  const { isLoading: athleteActivitiesLoading, data: athleteActivities } = useAthleteActivities(userId)
  const { loggedActivities, isLoading: loggedActivitiesLoading } = useUserLoggedActivities(userId)

  if (athleteActivitiesLoading || loggedActivitiesLoading) {
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
    <Activities
      loggedWorkouts={loggedActivities}
      stravaActivities={athleteActivities.res}
      userId={userId}
    />
  )
}

export default ActivityMain
