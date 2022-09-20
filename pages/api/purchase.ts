import { setCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setCookie('attempts', 'premium', {
    req,
    res,
    maxAge: 60 * 60 * 24 * 365 * 10,
  })
  res.writeHead(302, { Location: '/' }).end()
}
