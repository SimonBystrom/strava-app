import { FC } from 'react'
import { useUserStore } from '../../stores/userStore'
import { useAthleteStats } from '../../hooks/athleteStats';
import { StravaData } from '@prisma/client';
import { useLocalStorageTokens } from '../../hooks/localStorageTokens';
import { CheckStravaConnection } from '../checkStravaConnection/checkStravaConnection';
import { Loader } from '@mantine/core';

interface UserStatsProps {
  tokens: StravaData,
  userId: string,
}

export const UserStats: FC<UserStatsProps> = ({tokens, userId}) => {
  const { data: userData, isLoading, error } = useAthleteStats(tokens, userId)
  const { athlete } = useUserStore()
  console.log('tokens in UserStats', tokens, 'useAthleteStats isLoading status', isLoading)
  console.log('UserStats userData', userData)
  console.log('Athlete in UserStas', athlete)
  if(isLoading || !userData) {
    return (
      <>
        <Loader size="xl" />
        <p>Loader in UserStats</p>
      </>
    )
  }
  return (
    <div>
      Welcome {`${athlete.firstname} ${athlete.lastname}`}
      <p>Total Running time</p>
      <p>Hours: {userData.elapsedTime.hours}</p>
      <p>Minutes: {userData.elapsedTime.minutes}</p>
      <p>Seconds: {userData.elapsedTime.seconds}</p>
    </div>
  )
}


interface UserMainProps {
  userId: string
}

const UserMain: FC<UserMainProps> = ({userId}) => {
  const tokens = useLocalStorageTokens()
  console.log('tokens in UserMain', tokens)
  // If access token doesn't exit on local storage -> User hasn't logged in from this
  // browser before or user hasn't linked Strava account with their account.
  if(!tokens?.accessToken) {
    return <CheckStravaConnection userId={userId} checkAgainst='userStats'/>
  }

  // At this point an access Token should always exist -> Needs to render component
  // that checks if we need to re auth or now.
  return (
    <UserStats tokens={tokens} userId={userId}/>
  )
}

export default UserMain
