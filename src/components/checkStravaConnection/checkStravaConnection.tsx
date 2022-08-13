import { FC } from 'react'

interface CheckStravaConnectionProps {
  userId: string
}

const ConnectToStrava: FC<CheckStravaConnectionProps> = ({ userId }) => {

  const handleLogin = (id: string) => {
    const secureConnection = window.location.hostname !== 'localhost'
    const redirectUrl = `http${secureConnection ? 's' : ''}://${window.location.host}/redirect/${id}`
    const scope = 'read,activity:read_all'

    // Workaround to get rid of type issue with window.location not being allowed a string https://github.com/microsoft/TypeScript/issues/48949
    const win: Window = window
    win.location = `http://www.strava.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
      }&response_type=code&redirect_uri=${redirectUrl}/exchange_token&approval_prompt=force&scope=${scope}`
  }


    return (
      <div>
        <button onClick={() => handleLogin(userId)}>Connect to strava</button>
      </div>
    )
}

export default ConnectToStrava
