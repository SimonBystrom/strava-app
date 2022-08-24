import {FC, useState} from 'react'
import { Activity } from '../../../types/stravaTypes'
import Milestones from '../milestones/milestones'
import classes from './activities.module.scss'
import TimeLine from './timeLine/timeLine'

interface ActivitiesProps {
  activities: Activity[]
  userId: string
}
const Activities: FC<ActivitiesProps> = ({ activities, userId }) => {
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])

  return (
    <div className={classes.ActivitesPageWrapper}>
      <div className={classes.ActivitiesContainer}>
        <h2>ACTIVITIES</h2>
        <TimeLine activities={activities} customPeriod={customPeriod} setCustomPeriod={setCustomPeriod}/>
      </div>
      <div className={classes.MilestonesContainer}>
        <h2>MILESTONES</h2>
        <Milestones activities={activities} customPeriod={customPeriod} userId={userId}/>
      </div>
      <div className={classes.GoalsContainer}>
        <h2>GOALS</h2>
        <p>Show goals and progress</p>
      </div>
    </div>
  )
}

export default Activities
