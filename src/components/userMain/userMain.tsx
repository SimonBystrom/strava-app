import { FC, useEffect } from 'react'
import { Athlete, useUserStore } from '../../stores/userStore'
import { StravaData } from '@prisma/client';
import { useLocalStorageTokens } from '../../hooks/localStorageTokens';
import { CheckStravaConnection } from '../checkStravaConnection/checkStravaConnection';
import { Loader } from '@mantine/core';
import { getAthlete, getUserStats, reAuthGetter } from '../../utils/strava';
import { trpc } from '../../utils/trpc';
import { useQuery } from 'react-query';

// interface UserStatsProps {
//   tokens: StravaData,
//   userId: string,
// }

// export const UserStats: FC<UserStatsProps> = ({tokens, userId}) => {
//   // const { data: userData, isLoading, error } = useAthleteStats(tokens, userId)
//   const { data: userData, isLoading, error } = useAthleteStats(userId)
//   const { athlete } = useUserStore()
//   console.log('tokens in UserStats', tokens, 'useAthleteStats isLoading status', isLoading)
//   console.log('UserStats userData', userData)
//   console.log('Athlete in UserStas', athlete)
//   if(isLoading || !userData) {
//     return (
//       <>
//         <Loader size="xl" />
//         <p>Loader in UserStats</p>
//       </>
//     )
//   }
//   return (
//     <div>
//       Welcome {`${athlete.firstname} ${athlete.lastname}`}
//       <p>Total Running time</p>
//       <p>Hours: {userData.elapsedTime.hours}</p>
//       <p>Minutes: {userData.elapsedTime.minutes}</p>
//       <p>Seconds: {userData.elapsedTime.seconds}</p>
//     </div>
//   )
// }
interface UserStatsProps {
  tokens: StravaData,
}

export const UserStats: FC<UserStatsProps> = ({tokens}) => {
  const { athlete } = useUserStore()
   const {data: userData, isLoading} =  useQuery(
    ['userStats', athlete?.id, athlete.id],
    () => getUserStats(athlete?.id, tokens.accessToken),
    {
      enabled: !!athlete?.id && !!tokens.accessToken,
      // 5 min cached results
      staleTime: 300000,
    }
  )

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
  const { setAthlete } = useUserStore()
  const { mutateAsync } = trpc.useMutation(['stravaData.edit'])
  // If access token doesn't exit on local storage -> User hasn't logged in from this
  // browser before or user hasn't linked Strava account with their account.


  useEffect(() => {
    const getAthleteData = async(tokenParams: StravaData) => {
      const expired = new Date(tokenParams.expiresAt * 1000) < new Date()
      if (!expired) {
        console.log('Not expired in Usermain -> Getting athlete data ....')
        const athleteData = await getAthlete(tokenParams.accessToken)

        if (!athleteData) {
          console.log('no athlete for fetch in usermain')
          return
        }
        console.log('setting athlete Data to userMain', athleteData)
        setAthlete(athleteData)
        return
      }
      console.log('expierd in usermain')
      const newTokens = await reAuthGetter(tokenParams.refreshToken)
      if(!newTokens) {
        console.log('no New tokens found after reAuth in UserMain')
        return
      }
      console.log('New tokens from reauth in Usermain', newTokens)
      localStorage.setItem('strava', JSON.stringify(newTokens))
      await mutateAsync({
        ...newTokens,
        userId,
      })
      const athleteData = await getAthlete(newTokens.accessToken)
      if (!athleteData) {
        console.log('no athlete for refetch in usermain')
        return
      }
      console.log('new AthleteData from userMain', athleteData)
      setAthlete(athleteData)
      return
    }

    if(tokens) {
      console.log('Tokens found in UserMain UseEffect -> Starting to get athlete Data')
      getAthleteData(tokens)
    }
  }, [tokens, setAthlete, userId, mutateAsync])


  if (!tokens?.accessToken) {
    return <CheckStravaConnection userId={userId} checkAgainst='userStats' />
  }
  // At this point an access Token should always exist -> Needs to render component
  // that checks if we need to re auth or now.
  return (
    // <UserStats tokens={tokens} userId={userId}/>
    <UserStats tokens={tokens}/>
  )
}

export default UserMain
