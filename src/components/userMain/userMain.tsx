import Link from 'next/link'
import { FC } from 'react'
import { BaseStats } from '../../stores/userStatsStore'
import { Athlete } from '../../stores/userStore'
import classNames from 'classnames';
import classes from './userMain.module.scss'


interface UserMainProps {
  athlete: Athlete,
  runningsStats: BaseStats
}

const UserMain: FC<UserMainProps> = ({ athlete, runningsStats }) => {

  return (
    <div>
      Welcome {`${athlete.firstname} ${athlete.lastname}`}
      <p>Total Running time</p>
      <p>Hours: {runningsStats.elapsedTime.hours}</p>
      <p>Minutes: {runningsStats.elapsedTime.minutes}</p>
      <p>Seconds: {runningsStats.elapsedTime.seconds}</p>
    </div>
  )
}

export default UserMain
