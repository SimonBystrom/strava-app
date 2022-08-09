import {FC} from 'react'
import { StravaData } from "@prisma/client"
import { useEffect, useState } from "react"
import { handleLogin } from '../../utils/strava'
import { UserStats } from '../userMain/userMain'
import { UserActivity } from '../userActivity/userActivity'
import { trpc } from '../../utils/trpc'
import { Loader } from '@mantine/core'

interface CheckStravaConnectionProps {
  userId: string
  checkAgainst: 'userStats' | 'userActivity'
}

export const CheckStravaConnection: FC<CheckStravaConnectionProps> = ({ userId, checkAgainst }) => {
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
    if (stravaData && !isLoading) {
      setLocalStorage(stravaData)
    }
  }, [stravaData, isLoading])

  if (isLoading) {
    return (
      <Loader size="xl" />
    )
  }

  // If no strava data was found -> User doesn't have connected Strava account
  if (!stravaData || !tokens) {
    return (
      <div>
        <button onClick={() => handleLogin(userId)}>Connect to strava</button>
      </div>
    )
  }
  // User has a connected Strava account
  switch (checkAgainst) {
    case 'userStats':
      return (
        <UserStats tokens={tokens} />
      )
    case 'userActivity':
      return (
        <UserActivity tokens={tokens} />
      )

    default:
      return (
        <>...</>
      )
  }
}
