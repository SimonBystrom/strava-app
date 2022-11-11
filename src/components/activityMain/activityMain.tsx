import { Loader, Tabs} from '@mantine/core'
import { FC, useState } from 'react'
import { useAthleteActivities } from '../../hooks/athleteActivities'
import Activities from './activities/activites'
import ConnectToStrava from '../checkStravaConnection/checkStravaConnection'
import dayjs from 'dayjs'
import { trpc } from '../../utils/trpc'

interface ActivityMainProps {
  userId: string
}

const ActivityMain: FC<ActivityMainProps> = ({userId}) => {
  const currentDate = new Date()
  const [beforeDate, setBeforeDate] = useState<Date | undefined>(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
  const [afterDate, setAfterDate] = useState<Date | undefined>(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  // const firstDayPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
  // const lastDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1 , 0)
  const { isLoading, data: athleteActivities } = useAthleteActivities(userId, beforeDate, afterDate)

  const handleTabChange = (timePeriod: 'month' | 'year' | 'all') => {
    if(timePeriod === 'month') {
      setBeforeDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
      setAfterDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
    if(timePeriod === 'year') {
      setBeforeDate(new Date(currentDate.getFullYear(), 12, 0))
      setAfterDate(new Date(currentDate.getFullYear() - 1, 12, 0))
    }
  }

  if (isLoading) {
    return (
      <>
        <Loader size="xl" />
        <p>Activity Main loader</p>
      </>
    )
  }
  if (!athleteActivities) {
    return <ConnectToStrava userId={userId}/>
  }
  return (
    <Tabs defaultValue={dayjs(currentDate).format('MMMM')} onTabChange={(v) => {
      if (v === dayjs(currentDate).format('MMMM')) {
        handleTabChange('month')
      }
      if (v === dayjs(currentDate).format('YYYY')) {
        handleTabChange('year')
      }
    }}>
      <Tabs.List>
        <Tabs.Tab
          value={dayjs(currentDate).format('MMMM')}
          title='Show monthly milestones'
          color='red'

        >
          {dayjs(currentDate).format('MMMM')}
        </Tabs.Tab>
        <Tabs.Tab value={dayjs(currentDate).format('YYYY')} title='Show yearly milestones' color='blue'>
          {dayjs(currentDate).format('YYYY')}
        </Tabs.Tab>
        <Tabs.Tab value='All Time' title='Show all time milestones' color='green'>
          All Time
        </Tabs.Tab>
        {/* <Tabs.Tab value='Custom' title={custom ? 'Show custom milestones' : 'Select custom date range to enable custom tab'} color='gray' disabled={!custom}>
          custom
        </Tabs.Tab> */}
        <Tabs.Panel value={dayjs(currentDate).format('MMMM')}>
          <Activities activities={athleteActivities.runs} userId={userId}/>
        </Tabs.Panel>
        <Tabs.Panel value={dayjs(currentDate).format('YYYY')}>
          <Activities activities={athleteActivities.runs} userId={userId}/>
        </Tabs.Panel>
        <Tabs.Panel value='All Time'>


        </Tabs.Panel>
        {/* <Tabs.Panel value='Custom'>

        </Tabs.Panel> */}
      </Tabs.List>

    </Tabs>
  )
}

export default ActivityMain
