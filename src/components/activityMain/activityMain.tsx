import { Loader} from '@mantine/core'
import { FC } from 'react'
import { StravaData } from '@prisma/client'
import { useAthleteActivities } from '../../hooks/userActivities'
import Activities from './userActivity/activities/activites'
import { CheckStravaConnection } from '../checkStravaConnection/checkStravaConnection'
import { useLocalStorageTokens } from '../../hooks/localStorageTokens'


interface UserActivityProps {
  tokens: StravaData
}

export const UserActivity: FC<UserActivityProps> = ({ tokens }) => {
  const { isLoading, data: activities } = useAthleteActivities(tokens)

  if(isLoading || !activities) {
    return (
      <Loader size="xl" />
    )
  }
  return (
    <Activities activities={activities}/>
  )
}


interface ActivityMainProps {
  userId: string
}

const ActivityMain: FC<ActivityMainProps> = ({userId}) => {
  const tokens = useLocalStorageTokens()

  // If access token doesn't exit on local storage -> User hasn't logged in from this
  // browser before or user hasn't linked Strava account with their account.
  if (!tokens?.accessToken) {
    return (
      <CheckStravaConnection userId={userId} checkAgainst='userActivity' />
    )
  }

  // At this point an access Token should always exist -> Needs to render component
  // that checks if we need to re auth or now.
  return (
    <UserActivity tokens={tokens} />
  )
}

export default ActivityMain
