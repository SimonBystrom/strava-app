import { FC } from 'react'
import classes from './milestones.module.scss'
import classNames from 'classnames'
import { FiAward } from 'react-icons/fi'
import { useRunsByPeriod } from '../../../../hooks/runsByPeriod'
import { Tabs } from '@mantine/core'
import dayjs from 'dayjs'
import { Activity, RunningData } from '../../../../types/stravaTypes'
import { useUserMilestones } from '../../../../hooks/userMilestones'
import { MilestonePeriod } from '@prisma/client'

interface DistanceBadgeProps {
  label: string,
  big?: boolean,
  count: number
}

const DistanceBadge: FC<DistanceBadgeProps> = ({ label, big = false, count }) => {
  return (
    <div className={classes.Milestone}>
      <div className={classes.Counter}>
        <span>{count}</span>
      </div>
      <div className={classNames(classes.DistanceBadge, big && classes.Big)}>
        <FiAward />
        <span>{label}</span>
      </div>
    </div>
  )
}

interface MilestoneTabDataProps {
  period: RunningData,
  // goals: {label: string, count: number}[]
}

const MilestoneTabData: FC<MilestoneTabDataProps> = ({ period }) => {
  // if(goals.length > 0){
  //   return (
  //     <div className={classes.MilestoneDataContainer}>
  //       {goals.map((goal, idx) => {
  //         return (
  //           <DistanceBadge key={`${goal.label}-${idx}`} label={goal.label} count={goal.count}/>
  //         )
  //       })}

  //     </div>
  //   )
  // }
  return (
    <div className={classes.MilestoneDataContainer}>
      <DistanceBadge label='1K' count={period.oneKM} />
        <DistanceBadge label='2K' count={period.twoKM} />
        <DistanceBadge label='3K' count={period.threeKM} />
        <DistanceBadge label='5K' count={period.fiveKM} />
        <DistanceBadge label='10K' count={period.tenKM} big />
    </div>
  )
}


interface MilestonesProps {
  activities: Activity[]
  customPeriod: [Date | null, Date | null]
  userId: string
}

const Milestones: FC<MilestonesProps> = ({ activities, customPeriod, userId }) => {
  const { data: userMilestones } = useUserMilestones(userId)
  console.log(userMilestones)
  const { month, year, all, custom } = useRunsByPeriod(activities, customPeriod)
  const currentTime = new Date()

  const filteredDataMonth = activities.filter(activity => {
    const activityDate = new Date(activity.startDateLocal.slice(0, -1))
    return (activityDate.getMonth() === currentTime.getMonth()) && (activityDate.getFullYear() === currentTime.getFullYear())
  })

  const filteredDataYear = activities.filter(activity => {
    const activityDate = new Date(activity.startDateLocal.slice(0, -1))
    return activityDate.getFullYear() === currentTime.getFullYear()
  })

  const month1 = userMilestones
  .filter(goal => goal.forPeriod === MilestonePeriod.CURRENT_MONTH)
  .map(goal => {
    const count = filteredDataMonth.filter(activity => activity.distance > goal.distanceStart && activity.distance < goal.distanceEnd).length
    return {
      label: goal.label,
      count
    }
  })

  const year1 = userMilestones
    .filter(goal => goal.forPeriod === MilestonePeriod.CURRENT_YEAR)
    .map(goal => {
      const count = filteredDataYear.filter(activity => activity.distance > goal.distanceStart && activity.distance < goal.distanceEnd).length
      return {
        label: goal.label,
        count
      }
    })

  const all1 = userMilestones
    .filter(goal => goal.forPeriod === MilestonePeriod.ALL_TIME)
    .map(goal => {
      const count = activities.filter(activity => activity.distance > goal.distanceStart && activity.distance < goal.distanceEnd).length
      return {
        label: goal.label,
        count
      }
    })

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
        <MilestoneTabData period={month}/>
        {/* <MilestoneTabData period={month} goals={month1}/> */}
      </Tabs.Panel>
      <Tabs.Panel value={dayjs(currentTime).format('YYYY')}>
        <MilestoneTabData period={year} />
        {/* <MilestoneTabData period={year} goals={year1}/> */}
      </Tabs.Panel>
      <Tabs.Panel value='All Time'>
        <MilestoneTabData period={all} />
        {/* <MilestoneTabData period={all} goals={all1}/> */}
      </Tabs.Panel>
      <Tabs.Panel value='Custom'>
        {custom && <MilestoneTabData period={custom} />}
      </Tabs.Panel>
    </Tabs>
  )
}

export default Milestones
