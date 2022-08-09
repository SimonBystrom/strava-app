import { FC } from 'react'
import classes from './customTimeRangeData.module.scss'
import { RunningData } from '../../../../hooks/runsByPeriod'
import TimePeriodData from '../timePeriodData/timePeriodData'
import { DateRangePicker } from '@mantine/dates'

interface CustomTimeRangeDataProps {
  period: RunningData | null | undefined
  label?: string
  customPeriod: [Date | null, Date | null]
  setCustomPeriod: (e: [Date | null, Date | null]) => void
}

const CustomTimeRangeData: FC<CustomTimeRangeDataProps> = ({
  period,
  label,
  customPeriod,
  setCustomPeriod

}) => {

  return (
    <div className={classes.CustomRangeContainer}>
      {/* TODO: Fix this dirty conditional */}
      {period ? <TimePeriodData label={label} period={period}/> : <div></div>}
      <div className={classes.DatePickerContainer}>
        <h3>Pick a range</h3>
        <DateRangePicker
          placeholder='Pick custom range'
          value={customPeriod}
          onChange={setCustomPeriod}
          classNames={{
            root: classes.DateRangeRoot,
          }}
        />
      </div>
    </div>
  )
}

export default CustomTimeRangeData
