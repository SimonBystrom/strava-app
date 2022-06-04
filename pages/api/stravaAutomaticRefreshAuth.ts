import type { NextApiRequest, NextApiResponse } from 'next'



const reAuthStrava = async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  }

  const body = JSON.stringify({
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_SECRET,
    refresh_token: process.env.STRAVA_REFRESH_TOKEN,
    grant_type: 'refresh_token'
  })

  const reauthorizeRespone = await fetch('https://www.strava.com/oauth/token', {
    method: 'post',
    "headers": headers,
    "body": body
  })

  const reAuthJson = await reauthorizeRespone.json()

  const response = await fetch('https://www.strava.com/api/v3/athletes/{athlete_id}/stats?access_token='+reAuthJson.access_token)
  const data = await response.json()

  return res.status(200).json({
    data
  })
}

export default reAuthStrava
