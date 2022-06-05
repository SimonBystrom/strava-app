import Link from 'next/link'
import { FC } from 'react'
import { Athlete } from '../../stores/userStore'

interface UserMainProps {
  athlete: Athlete
}

const UserMain: FC<UserMainProps> = ({ athlete }) => {
  return (
    <div>
      Welcome {`${athlete.firstname} ${athlete.lastname}`}
    </div>
  )
}

export default UserMain
