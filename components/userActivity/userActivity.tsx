import { Select, Tabs } from '@mantine/core'
import { Calendar } from '@mantine/dates'
import dayjs from 'dayjs'
import { FC, useState } from 'react'
import { RunningData, useRunsByPeriod } from '../../hooks/runsByPeriod'
import { Activity } from '../../stores/userActivitiesStore'
import classes from './userActivity.module.scss'
import { useAllActivityDates } from '../../hooks/allActivityDates'
import TimePeriodData from './timePeriodData/timePeriodData'
import CustomTimeRangeData from './customTimeRangeData/customTimeRangeData'

interface MilestoneTabDataProps {
  period: RunningData
}

const MileStoneTabData: FC<MilestoneTabDataProps> = ({period}) => {
  return (
    <>
      <div>1KM: {period.oneKM}</div>
      <div>2KM: {period.twoKM}</div>
      <div>3KM: {period.threeKM}</div>
      <div>5KM: {period.fiveKM}</div>
      <div>10KM: {period.tenKM}</div>
    </>
  )
}

interface MilestonesProps {
  activities: Activity[]
  customPeriod: [Date | null, Date | null]
}

const Milestones: FC<MilestonesProps> = ({ activities, customPeriod}) => {
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)

  const currentTime = new Date()

  return (
    <Tabs>
      <Tabs.Tab label={dayjs(currentTime).format('MMMM')} title='Show monthly milestones' color='red'>
        <MileStoneTabData period={month}/>
      </Tabs.Tab>
      <Tabs.Tab label={dayjs(currentTime).format('YYYY')} title='Show yearly milestones' color='blue'>
        <MileStoneTabData period={year} />
      </Tabs.Tab>
      <Tabs.Tab label='All Time' title='Show all time milestones' color='green'>
        <MileStoneTabData period={all} />
      </Tabs.Tab>
      <Tabs.Tab label='Custom' title={custom ? 'Show custom milestones' : 'Select custom date range to enable custom tab'} color='gray' disabled={!custom}>
        {custom && <MileStoneTabData period={custom} /> }
      </Tabs.Tab>
    </Tabs>
  )
}

interface UserActivityProps {
  activities: Activity[]
}

const UserActivity: FC<UserActivityProps> = ({ activities }) => {
  const [customPeriod, setCustomPeriod] = useState<[Date | null, Date | null]>([null, null])
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const allDates = useAllActivityDates(activities)
  const currentTime = new Date()
  // TODO: Refactor the 'Activities' List into it's own component
  return (
    <div className={classes.ActivitesPageWrapper}>
      <div className={classes.ActivitiesContainer}>
        <h2>ACTIVITIES</h2>
        <div className={classes.ActivityGridWrapper}>
          <div className={classes.TimeLineDataContainer}>
            <TimePeriodData label={dayjs(currentTime).format('MMMM')} period={month}/>
            <TimePeriodData label={dayjs(currentTime).format('YYYY')} period={year}/>
            <TimePeriodData label='All Time' period={all}/>
          </div>
          <div className={classes.Calendar}>
            <Calendar
              onChange={() => {}}
              dayStyle={(date) => {
                date.toISOString().slice(0, -1)
                const dateMatch = allDates.some(activityDate => {
                  return (activityDate.getFullYear() === date.getFullYear()) && (activityDate.getMonth() === date.getMonth()) && (activityDate.getDate() === date.getDate())
                })
                if (dateMatch){
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
        <Milestones activities={activities} customPeriod={customPeriod}/>
      </div>
      <div className={classes.GoalsContainer}>
        <h2>GOALS</h2>
        <p>Show goals and progress</p>
      </div>
    </div>
  )
}

export default UserActivity
