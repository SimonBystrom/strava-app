import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import { authGetter } from "../../utils/strava";


const Redirect: NextPage = () => {
  const router = useRouter()
  const {setAthlete, setAccessToken, setRefreshToken} = useUserStore()
  useEffect(() => {
    const authenticate = async (query: ParsedUrlQuery) => {
      const stravaAuthToken = query.code as string
      // All neccessary tokens from the strava res
      const tokens = await authGetter(stravaAuthToken)

      // Save tokens to store for easier fetch on tabs
      if(tokens) {
        setAccessToken(tokens.access_token)
        setRefreshToken(tokens.refresh_token)
        setAthlete(tokens.athlete)
      }
    }
    if(router.query.code) {
      authenticate(router.query)
      router.push('/user')
    }
  }, [router, setAccessToken, setAthlete, setRefreshToken])

  return(
    <div>
      Loading ...
    </div>
  )
}

export default Redirect
