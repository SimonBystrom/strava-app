import { useQuery } from "react-query"

import * as api from '../pages/api/strava/authenticateAthlete'


export const useAuthenticateAthlete = (authToken: string) => {
  return useQuery(['authenticateAthlete', authToken],
    () => api.authenticateAthlete(authToken),
    {
      enabled: !!authToken
    }
  )
}
