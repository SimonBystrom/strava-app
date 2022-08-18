import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthenticateAthlete } from "../../../hooks/athleteAuthenticate";
import { trpc } from "../../../utils/trpc";


const Redirect: NextPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const stravaAuthToken = router.query.code as string
  const { data: tokens, isLoading, error: creatingError } = useAuthenticateAthlete(stravaAuthToken)
  const { mutateAsync } = trpc.useMutation(['stravaData.create'])


  useEffect(() => {
    const authenticate = async () => {
      if (tokens && !isLoading) {
        await mutateAsync({
          userId: id,
          refreshToken: tokens.refreshToken,
          accessToken: tokens.accessToken,
          expiresAt: tokens.expiresAt,
          athleteId: tokens.athlete.id,
        })
        if (creatingError) {
          console.error('Error creating the DB Strava Data')
          return
        }
        router.push(`/dashboard/user`)
      }
    }
    authenticate()
  }, [tokens, isLoading, creatingError, mutateAsync, id, router])

  return(
    <div>
      Loading ...
    </div>
  )
}

export default Redirect
