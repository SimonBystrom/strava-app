import { LoggedActivity, Workout } from '@prisma/client'
import {FC, useState} from 'react'
import { Activity } from '../../../types/stravaTypes'
import Milestones from '../milestones/milestones'
import classes from './activities.module.scss'
import TimeLine from './timeLine/timeLine'

interface ActivitiesProps {
  stravaActivities: Activity[]
  loggedWorkouts: (LoggedActivity & {workout: Workout})[]
  userId: string
}
const Activities: FC<ActivitiesProps> = ({
  stravaActivities,
  loggedWorkouts,
  userId
}) => {
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])

  return (
    <div className={classes.ActivitesPageWrapper}>
      <div className={classes.ActivitiesContainer}>
        <h2>ACTIVITIES</h2>
        <TimeLine
          loggedWorkouts={loggedWorkouts}
          stravaActivities={stravaActivities}
          customPeriod={customPeriod}
          setCustomPeriod={setCustomPeriod}
        />
      </div>
      <div className={classes.MilestonesContainer}>
        <h2>MILESTONES</h2>
        <Milestones activities={stravaActivities} customPeriod={customPeriod} userId={userId}/>
      </div>
      <div className={classes.GoalsContainer}>
        <h2>GOALS</h2>
        <p>Show goals and progress</p>
      </div>
    </div>
  )
}

export default Activities
