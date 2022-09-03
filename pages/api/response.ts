// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const GenerateResponse = async () => {
  const { Configuration, OpenAIApi } = require('openai')
  const configuration = new Configuration({
    apiKey: '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',
  })

  const openai = new OpenAIApi(configuration)
  const answer: any = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: 'Is the woman romantically attracted to the man? (Yes, Maybe, Probably Not, No) /n Him: hey /n Her: go away',
    max_tokens: 256,
    temperature: 0,
  })
  return answer.data.choices[0].text
}
  const answer = await GenerateResponse()
  res.status(200).json({ answer: answer })
}