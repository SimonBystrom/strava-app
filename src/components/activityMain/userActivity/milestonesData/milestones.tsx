import { FC } from 'react'
import classes from './milestones.module.scss'
import classNames from 'classnames'
import { FiAward } from 'react-icons/fi'
import { RunningData, useRunsByPeriod } from '../../../../hooks/runsByPeriod'
import { Tabs } from '@mantine/core'
import dayjs from 'dayjs'
import { Activity } from '../../../../stores/userActivitiesStore'

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
  period: RunningData
}

const MilestoneTabData: FC<MilestoneTabDataProps> = ({ period }) => {
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
}

const Milestones: FC<MilestonesProps> = ({ activities, customPeriod }) => {
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

export default Milestones
