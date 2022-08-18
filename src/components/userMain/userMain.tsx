import { FC, useEffect } from 'react'
import { Avatar, Badge, Button, Card, CardSection, Group, Image, Loader, Text } from '@mantine/core';
import { useAthleteStats } from '../../hooks/athleteStats';
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection';
import { BaseStats } from '../../types/stravaTypes';
import dayjs from 'dayjs'
import classes from './userMain.module.scss'

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
    <>
      {/* <UserStats athleteStats={athleteStats.stats} /> */}
      <h4>Connected tech</h4>
      <Card withBorder shadow='sm' radius='md' className={classes.CardRoot}>
        <Card.Section withBorder inheritPadding py='xs'>
          <Group position='apart'>
            <Text>STRAVA</Text>
            <Badge>Premium</Badge>
          </Group>
        </Card.Section>
        <Group mt='sm'>
          <Avatar src={athleteStats.account.profilePicUrl} alt='strava profile image' />

          <div>
            <Text>{athleteStats.account.firstName} {athleteStats.account.lastName}</Text>
            <Text color='dimmed' size='sm'>{athleteStats.account.username}</Text>
          </div>
          {/* {athleteStats.account.premium &&} */}
        </Group>
        <Text mt='sm'>Member since: {dayjs(athleteStats.account.createdAt).format('MMMM D, YYYY')}</Text>
        <Card.Section inheritPadding py='xs'>
          <Group position='apart'>
            <Button variant='subtle'>Unlink</Button>
            <Button variant='filled'>View Profile</Button>

          </Group>
        </Card.Section>
      </Card>

      {/* <p></p>
      <p>{athleteStats.account.firstName} {athleteStats.account.lastName}</p>
      <p>Premium: { athleteStats.account.premium ? 'true' : 'false' }</p>
      <p></p> */}
    </>
  )
}

export default UserMain
