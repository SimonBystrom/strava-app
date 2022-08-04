import Link from 'next/link'
import { FC } from 'react'
import { BaseStats } from '../../stores/userStatsStore'
import { Athlete } from '../../stores/userStore'
import classNames from 'classnames';
import classes from './userMain.module.scss'
// import { VictoryPie } from 'victory';


interface UserMainProps {
  athlete: Athlete,
  runningsStats: BaseStats
}

const UserMain: FC<UserMainProps> = ({ athlete, runningsStats }) => {
  const testData =
    [
      { x: "A", y: 35 },
      { x: "B", y: 40 },
      { x: "C", y: 55 },
      { x: "D", y: 15 },
    ]


  return (
    <div>
      Welcome {`${athlete.firstname} ${athlete.lastname}`}
      <p>Total Running time</p>
      <p>Hours: {runningsStats.elapsedTime.hours}</p>
      <p>Minutes: {runningsStats.elapsedTime.minutes}</p>
      <p>Seconds: {runningsStats.elapsedTime.seconds}</p>
      {/* <PieChart width={400} height={400}>
        <Pie
          data={testData}
          cx={200}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey='value'
          >
            {testData.map((entry, index) => {
              return (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              )
            })}
        </Pie>
      </PieChart> */}
      {/* <div className={classes.TestPie}>
        <VictoryPie
          data={testData}
        />
      </div> */}
    </div>
  )
}

export default UserMain
