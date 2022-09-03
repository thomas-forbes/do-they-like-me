// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Message } from '../../utils/types'
const { Configuration, OpenAIApi } = require('openai')

const Prompt = `How likely is person 2 romantically interested in person 1? (Definitely, Most likely, Can't Tell, Probably don't, or Definitely don't)

person 1: hey
person 2: hey
person 1: how was your day
person 2: fine
answer: Probably don't

person 1: hey
person 2: I love you
answer: Definitely

person 1: How was your day?
person 2: ok
answer: Can't Tell

person 2: Hey
person 1: Hi, how are you?
person 2: fine
person 1: wyd?
person 2: nothing
person 1: How was your day?
person 2: fine 
answer: Probably don't

`

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const messages: Message[] = JSON.parse(req.body).messages
  const formattedMessages = messages
    .map(
      (message) =>
        (message.from == 'you' ? 'person 1: ' : 'person 2: ') + message.message
    )
    .join('\n')

  const wholePrompt = Prompt + formattedMessages + '\n' + 'answer:'
  console.log(wholePrompt)

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  })
  const openai = new OpenAIApi(configuration)
  const response: any = await openai.createCompletion({
    model: 'text-davinci-002',
    prompt: wholePrompt,
    max_tokens: 5,
    temperature: 0.5,
  })
  const answer = response.data.choices[0].text.trim()
  res.status(200).json({ answer: answer })
}
