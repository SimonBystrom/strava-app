import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import { BaseStats } from '../../stores/userStatsStore'
import { Athlete, useUserStore } from '../../stores/userStore'
import classNames from 'classnames';
import classes from './userMain.module.scss'
import { useAthleteStats } from '../../hooks/userStats';
import { Session } from 'next-auth';
import { trpc } from '../../utils/trpc';
import { handleLogin } from '../../utils/strava';
import { StravaData } from '@prisma/client';

// export type Tokens = { accessToken: string, refreshToken: string, expiresAt: number, userId: string }

interface UserStatsProps {
  tokens: StravaData
}

const UserStats: FC<UserStatsProps> = ({tokens}) => {
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

interface CheckStravaConnectionProps {
  userId: string
}

const CheckStravaConnection: FC<CheckStravaConnectionProps> = ({userId}) => {
   const { data: stravaData, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  const [tokens, setTokens] = useState<StravaData | null>(null)

   useEffect(() => {
    const asyncLocalStorage = {
       setItem: async function (key: string, value: string) {
         await null;
         return localStorage.setItem(key, value);
       },
       getItem: async function (key: string) {
         await null;
         return localStorage.getItem(key);
       }
     }
     const setLocalStorage = async (stravaData: StravaData) => {
       const stravaTokens = {
         accessToken: stravaData.accessToken,
         refreshToken: stravaData.refreshToken,
         expiresAt: stravaData.expiresAt
       }
        await asyncLocalStorage.setItem('strava', JSON.stringify(stravaTokens))
        setTokens(stravaData)
     }
    if(stravaData && !isLoading) {
      setLocalStorage(stravaData)
    }
   }, [stravaData, isLoading])

  if (isLoading) {
    return (
      <p>Loading ... (is trying to fetch stravaData from db)</p>
    )
  }

  // If no strava data was found -> User doesn't have connected Strava account
  if(!stravaData || !tokens) {
    return (
     <div>
       <button onClick={() => handleLogin(userId)}>Connect to strava</button>
     </div>
    )
  }
  // User has a connected Strava account
  return (
    <UserStats tokens={tokens}/>
  )
}


interface UserMainProps {
  userId: string
}

const UserMain: FC<UserMainProps> = ({userId}) => {
  const [tokens, setTokens] = useState<StravaData | null>(null)


  useEffect(() => {
    const asyncLocalStorage = {
      setItem: async function (key: string, value: string) {
        await null;
        return localStorage.setItem(key, value);
      },
      getItem: async function (key: string) {
        await null;
        return localStorage.getItem(key);
      }
    }
    const checkLocalStorage = async () => {
      const localStorageObj = await asyncLocalStorage.getItem('strava')
        if (localStorageObj) {
          console.log('local Storage with tokens found in UserMain')
          setTokens(JSON.parse(localStorageObj))
        }
    }

    checkLocalStorage()
  }, [])

  // If access token doesn't exit on local storage -> User hasn't logged in from this
  // browser before or user hasn't linked Strava account with their account.
  if(!tokens?.accessToken) {
    return (
      <CheckStravaConnection userId={userId}/>
    )
  }

  // At this point an access Token should always exist -> Needs to render component
  // that checks if we need to re auth or now.
  return (
    <UserStats tokens={tokens}/>
  )
}

export default UserMain
