import {FC} from 'react'
import { StravaData } from "@prisma/client"
import { useEffect, useState } from "react"
import { getAthlete, handleLogin, reAuthGetter } from '../../utils/strava'
import { UserStats } from '../userMain/userMain'
import { trpc } from '../../utils/trpc'
import { Loader } from '@mantine/core'
import { asyncLocalStorage } from '../../utils/asyncLocalStorage'
import { UserActivity } from '../activityMain/activityMain'
import { useUserStore } from '../../stores/userStore'

type StravaReliantComponents = 'userStats' | 'userActivity'

interface CheckStravaConnectionProps {
  userId: string
  checkAgainst: StravaReliantComponents
}

export const CheckStravaConnection: FC<CheckStravaConnectionProps> = ({ userId, checkAgainst }) => {
  const { data: stravaData, isLoading } = trpc.useQuery(['stravaData.getById', { id: userId }])
  const [tokens, setTokens] = useState<StravaData | null>(null)
  const { setAthlete } = useUserStore()
  const { mutateAsync } = trpc.useMutation(['stravaData.edit'])
  console.log('Check Strava connection')
  useEffect(() => {
    const getAthleteData = async (tokenParams: StravaData) => {
      const expired = new Date(tokenParams.expiresAt * 1000) < new Date()
      if (!expired) {
        console.log('Not expired in Checkstravaconnection -> Getting athlete data ....')
        const athleteData = await getAthlete(tokenParams.accessToken)

        if (!athleteData) {
          console.log('no athlete for fetch in checkstravaconnection')
          return
        }
        console.log('setting athlete Data to checkstravaconnection', athleteData)
        setAthlete(athleteData)
        return
      }
      console.log('expierd in checkstravaconnection')
      const newTokens = await reAuthGetter(tokenParams.refreshToken)
      if (!newTokens) {
        console.log('no New tokens found after reAuth in Checkstravaconnection')
        return
      }
      console.log('New tokens from reauth in Checkstravaconnection', newTokens)
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
      getAthleteData(stravaData)
    }
  }, [stravaData, isLoading, mutateAsync, setAthlete, userId])

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
