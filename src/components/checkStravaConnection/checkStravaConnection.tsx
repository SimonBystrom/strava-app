import {FC} from 'react'
import { StravaData } from "@prisma/client"
import { useEffect, useState } from "react"
import { handleLogin } from '../../utils/strava'
import { UserStats } from '../userMain/userMain'
import { trpc } from '../../utils/trpc'
import { Loader } from '@mantine/core'
import { asyncLocalStorage } from '../../utils/asyncLocalStorage'
import { UserActivity } from '../activityMain/activityMain'

type StravaReliantComponents = 'userStats' | 'userActivity'

interface CheckStravaConnectionProps {
  userId: string
  checkAgainst: StravaReliantComponents
}

export const CheckStravaConnection: FC<CheckStravaConnectionProps> = ({ userId, checkAgainst }) => {
  const { data: stravaData, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  const [tokens, setTokens] = useState<StravaData | null>(null)
  console.log('Check Strava connection')
  useEffect(() => {
    console.log('starting check strava connection useEffect')
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
      console.log('Strava check data if statement loaded -> StravaData found, and trpc client is not loading')
      setLocalStorage(stravaData)
    }
  }, [stravaData, isLoading])

  if (isLoading) {
    return (
      <>
        <Loader size="xl" />
        <p>Check strava loader...</p>
      </>
    )
  }

  // If no strava data was found -> User doesn't have connected Strava account
  // TODO: Separate into own component / Make it look good!
  if (!stravaData || !tokens) {
    return (
      <div>
        <button onClick={() => handleLogin(userId)}>Connect to strava</button>
      </div>
    )
  }
  // User has a connected Strava account -> Render correct StravaRelated components based on where
  // this component is being rendered
  switch (checkAgainst) {
    case 'userStats':
      return (
        // <UserStats tokens={tokens} userId={userId}/>
        <UserStats tokens={tokens}/>
      )
    case 'userActivity':
      return (
        <UserActivity tokens={tokens} userId={userId} />
      )

    default:
      return (
        <>...</>
      )
  }
}
