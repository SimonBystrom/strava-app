import { useQuery } from "react-query"

import * as api from '../pages/api/strava/authenticateAthlete'


export const useAuthenticateAthlete = (authToken: string) => {
  console.log('useAuthenticate hook auth token is', authToken)
  return useQuery(['authenticateAthlete', authToken],
    () => api.authenticateAthlete(authToken),
    {
      enabled: !!authToken
    }
  )
}
