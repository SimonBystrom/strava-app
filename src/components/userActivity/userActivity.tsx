import { Select, Tabs } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { useRunsByPeriod } from '../../hooks/runsByPeriod'
import { Activity } from '../../stores/userActivitiesStore'
import classes from './userActivity.module.scss'
import { useAllActivityDates } from '../../hooks/allActivityDates'
import TimePeriodData from './timePeriodData/timePeriodData'
import CustomTimeRangeData from './customTimeRangeData/customTimeRangeData'
import MilestoneTabData from './milestonesData/milestones'
import { useLocalStorageTokens } from '../../hooks/localStorageTokens'
import { CheckStravaConnection } from '../userMain/userMain'
import { StravaData } from '@prisma/client'
import { useActivities } from '../../hooks/userActivities'

interface MilestonesProps {
  activities: Activity[]
  customPeriod: [Date | null, Date | null]
}

const Milestones: FC<MilestonesProps> = ({ activities, customPeriod}) => {
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const currentTime = new Date()

  return (
    <Tabs defaultValue={dayjs(currentTime).format('MMMM')}>
      <Tabs.List>
        <Tabs.Tab value={dayjs(currentTime).format('MMMM')} title='Show monthly milestones' color='red'>
          {dayjs(currentTime).format('MMMM')}
        </Tabs.Tab>
        <Tabs.Tab value={dayjs(currentTime).format('YYYY')} title='Show yearly milestones' color='blue'>
          {dayjs(currentTime).format('YYYY')}
        </Tabs.Tab>
        <Tabs.Tab value='All Time' title='Show all time milestones' color='green'>
          All Time
        </Tabs.Tab>
        <Tabs.Tab value='Custom' title={custom ? 'Show custom milestones' : 'Select custom date range to enable custom tab'} color='gray' disabled={!custom}>
          custom
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={dayjs(currentTime).format('MMMM')}>
        <MilestoneTabData period={month} />
      </Tabs.Panel>
      <Tabs.Panel value={dayjs(currentTime).format('YYYY')}>
        <MilestoneTabData period={year} />
      </Tabs.Panel>
      <Tabs.Panel value='All Time'>
        <MilestoneTabData period={all} />
      </Tabs.Panel>
      <Tabs.Panel value='Custom'>
        {custom && <MilestoneTabData period={custom} />}
      </Tabs.Panel>
    </Tabs>
  )
}

interface ActivitiesProps {
  activities: Activity[]
}
const Activities: FC<ActivitiesProps> = ({activities}) => {
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const allDates = useAllActivityDates(activities)
  const currentTime = new Date()

  return (
    <div className={classes.ActivitesPageWrapper}>
      <div className={classes.ActivitiesContainer}>
        <h2>ACTIVITIES</h2>
        <div className={classes.ActivityGridWrapper}>
          <div className={classes.TimeLineDataContainer}>
            <TimePeriodData label={dayjs(currentTime).format('MMMM')} period={month} />
            <TimePeriodData label={dayjs(currentTime).format('YYYY')} period={year} />
            <TimePeriodData label='All Time' period={all} />
          </div>
          <div className={classes.Calendar}>
            <Calendar
              onChange={() => { }}
              dayStyle={(date) => {
                date.toISOString().slice(0, -1)
                const dateMatch = allDates.some(activityDate => {
                  return (activityDate.getFullYear() === date.getFullYear()) && (activityDate.getMonth() === date.getMonth()) && (activityDate.getDate() === date.getDate())
                })
                if (dateMatch) {
                  return {
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    color: 'white',
                    opacity: '0.8',
                    transform: 'scale(0.8)',
                    fontSize: '16px',
                  }
                }
                return {}
              }}
            />
          </div>
          <CustomTimeRangeData
            label='Custom Range'
            period={custom}
            customPeriod={customPeriod}
            setCustomPeriod={setCustomPeriod}
          />
        </div>
      </div>
      <div className={classes.MilestonesContainer}>
        <h2>MILESTONES</h2>
        <Milestones activities={activities} customPeriod={customPeriod} />
      </div>
      <div className={classes.GoalsContainer}>
        <h2>GOALS</h2>
        <p>Show goals and progress</p>
      </div>
    </div>
  )
}

interface UserActivityProps {
  // activities: Activity[]
  tokens: StravaData
}

const UserActivity: FC<UserActivityProps> = ({ tokens }) => {
  const { isLoading, data: activities } = useActivities(tokens)


  if(isLoading || !activities) {
    return (
      <p>Loading ...</p>
    )
  }
  // TODO: Refactor the 'Activities' List into it's own component
  return (
    <Activities activities={activities}/>
  )
}


interface ActivityMainProps {
  userId: string
}

const ActivityMain: FC<ActivityMainProps> = ({userId}) => {
  const tokens = useLocalStorageTokens()

  // If access token doesn't exit on local storage -> User hasn't logged in from this
  // browser before or user hasn't linked Strava account with their account.
  if (!tokens?.accessToken) {
    return (
      <CheckStravaConnection userId={userId} checkAgainst='userActivity' />
    )
  }

  return (
    <UserActivity tokens={tokens} />
  )
}

export default ActivityMain
