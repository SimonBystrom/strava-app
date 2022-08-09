import { FC } from 'react'
import { useUserStore } from '../../stores/userStore'
import { useAthleteStats } from '../../hooks/userStats';
import { StravaData } from '@prisma/client';
import { useLocalStorageTokens } from '../../hooks/localStorageTokens';
import { CheckStravaConnection } from '../checkStravaConnection/checkStravaConnection';

// export type Tokens = { accessToken: string, refreshToken: string, expiresAt: number, userId: string }

interface UserStatsProps {
  tokens: StravaData
}

export const UserStats: FC<UserStatsProps> = ({tokens}) => {
  const { data: userData, isLoading } = useAthleteStats(tokens)
  const { athlete } = useUserStore()

  return (
    <>
      {isLoading && <p>Loading ...</p>}
      {!isLoading && userData &&
        <div>
          Welcome {`${athlete.firstname} ${athlete.lastname}`}
          <p>Total Running time</p>
          <p>Hours: {userData.elapsedTime.hours}</p>
          <p>Minutes: {userData.elapsedTime.minutes}</p>
          <p>Seconds: {userData.elapsedTime.seconds}</p>
       </div>
      }
    </>
  )
}


interface UserMainProps {
  userId: string
}

const UserMain: FC<UserMainProps> = ({userId}) => {
  const tokens = useLocalStorageTokens()

  // If access token doesn't exit on local storage -> User hasn't logged in from this
  // browser before or user hasn't linked Strava account with their account.
  if(!tokens?.accessToken) {
    return (
      <CheckStravaConnection userId={userId} checkAgainst='userStats'/>
    )
  }

  // At this point an access Token should always exist -> Needs to render component
  // that checks if we need to re auth or now.
  return (
    <UserStats tokens={tokens}/>
  )
}

export default UserMain
