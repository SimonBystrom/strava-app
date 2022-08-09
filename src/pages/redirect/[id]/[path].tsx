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
  const {setAthlete} = useUserStore()
  const {mutateAsync} = trpc.useMutation(['stravaData.create'])



  useEffect(() => {
    const asyncLocalStorage = {
      setItem: async function (key: string, value: string) {
        await null;
        return localStorage.setItem(key, value);
      },
      getItem: async function (key: string) {
        await null;
        return localStorage.getItem(key);
      }
    }

    const authenticate = async (query: ParsedUrlQuery) => {
      const stravaAuthToken = query.code as string
      // All neccessary tokens from the strava res
      const tokens = await authGetter(stravaAuthToken)

      // const stravaTokens = {
      //   accessToken: tokens.access_token,
      //   refreshToken: tokens.refresh_token,
      //   expiresAt: tokens.expires_at
      // }
      await asyncLocalStorage.setItem('strava', JSON.stringify(tokens))
      // Save Athlete to store for easier fetch on tabs
      if(tokens?.athlete) {
        setAthlete(tokens.athlete)
      }
      if(tokens) {
        await mutateAsync({
          userId: id,
          refreshToken: tokens.refreshToken,
          accessToken: tokens.accessToken,
          expiresAt: tokens.expiresAt
        })
      }
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
