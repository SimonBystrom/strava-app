import {FC} from 'react'
import { BiHash, BiRun, BiTimeFive } from 'react-icons/bi'
import { RunningData } from '../../../../types/stravaTypes'
import { convertToKm } from '../../../../utils/distanceConverter'
import classes from './timePeriodData.module.scss'

interface TimePeriodDataProps {
  period: RunningData
  label?: string
}
const TimePeriodData: FC<TimePeriodDataProps> = ({ period, label }) => {
  return (
    <div>
      {label && <h3>{label}</h3>}
      <div className={classes.TimePeriodData}>
        <div className={classes.DataContainer}><BiRun /> <p>{convertToKm(period.distance)} km</p></div>
        <div className={classes.DataContainer}><BiTimeFive /> <p>{period.time.hours}:{period.time.minutes}:{period.time.seconds} </p></div>
        <div className={classes.DataContainer}><BiHash /> <p>{period.total}</p></div>
      </div>
    </div>
  )
}

export default TimePeriodData
