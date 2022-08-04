import { FC } from 'react'
import classes from './milestones.module.scss'
import classNames from 'classnames'
import { FiAward } from 'react-icons/fi'
import { RunningData } from '../../../hooks/runsByPeriod'

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

export default MilestoneTabData
