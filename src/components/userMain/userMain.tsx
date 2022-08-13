import { FC } from 'react'
import { Loader } from '@mantine/core';
import { useAthleteStats } from '../../hooks/athleteStats';
// import { BaseStats } from '../../stores/userStatsStore';
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection';
import { BaseStats } from '../../types/stravaTypes';

interface UserStatsProps {
  athleteStats: BaseStats
}

export const UserStats: FC<UserStatsProps> = ({athleteStats}) => {
  return (
    <div>
      {/* Welcome {`${athlete.firstname} ${athlete.lastname}`} */}
      <p>Total Running time</p>
      <p>Hours: {athleteStats.elapsedTime.hours}</p>
      <p>Minutes: {athleteStats.elapsedTime.minutes}</p>
      <p>Seconds: {athleteStats.elapsedTime.seconds}</p>
    </div>
  )
}


interface UserMainProps {
  userId: string
}

const UserMain: FC<UserMainProps> = ({userId}) => {
  const {data: athleteStats, isLoading} = useAthleteStats(userId)

  if (isLoading) {
    return (
      <>
        <Loader></Loader>
        <p>User Main loader</p>
      </>
    )
  }
  if (!athleteStats) {
    return <ConnectToStrava userId={userId}/>
  }

  return (
    <UserStats athleteStats={athleteStats} />
  )
}

export default UserMain
