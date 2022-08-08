import { NextPage } from "next";
import { SessionStore } from "next-auth/core/lib/cookie";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect } from "react";
import { useUserStore } from "../../../stores/userStore";
import { authGetter } from "../../../utils/strava";
import { trpc } from "../../../utils/trpc";


const Redirect: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const {setAthlete, setAccessToken, setRefreshToken,  setExpiresAt} = useUserStore()
  const {mutateAsync} = trpc.useMutation(['stravaData.create'])

  useEffect(() => {
    const authenticate = async (query: ParsedUrlQuery) => {
      const stravaAuthToken = query.code as string
      // All neccessary tokens from the strava res
      const tokens = await authGetter(stravaAuthToken)

      const stravaTokens = {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expires_at
      }
      setAccessToken(stravaTokens.accessToken)
      setRefreshToken(stravaTokens.refreshToken)
      setExpiresAt(stravaTokens.expiresAt)
      localStorage.setItem('strava', JSON.stringify(stravaTokens))
      // Save tokens to store for easier fetch on tabs
      setAthlete(tokens.athlete)
      // if(tokens && id) {
      //   const expiresAt = new Date(tokens.expires_at * 1000)
    //   await mutateAsync({
      //     refreshToken: tokens.refresh_token,
      //     accessToken: tokens.access_token,
      //     expiresAt,
      //     userId: id
      //   })
      // }

    }
    if(router.query.code) {
      authenticate(router.query)
      router.push(`/dashboard/user`)
    }
  }, [router, id, setAthlete, mutateAsync])

  return(
    <div>
      Loading ...
    </div>
  )
}

export default Redirect
