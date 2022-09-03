import { useEffect, useState } from 'react'
import { Message } from '../utils/types'

const MessageView = ({
  message,
  onChange,
  remove,
  onEnter,
  inputRef,
}: {
  message: Message
  onChange: any
  remove: any
  onEnter: any
  inputRef: any
}) => {
  return (
    <div className="flex flex-row py-1 px-3 items-center w-full">
      <p className="flex-1 text-white">{message.from}:</p>
      <input
        type="text"
        placeholder="Message..."
        className="flex-[4] bg-black border-b border-[#32373e] focus:outline-none"
        value={message.message}
        onKeyDown={(e) => (e.code == 'Enter' ? onEnter() : null)}
        onChange={onChange}
        ref={inputRef}
      />
      <p onClick={remove} className="ml-1 hover:cursor-pointer font-bold">
        ｘ
      </p>
    </div>
  )
}

export default function Home() {
  const [messages, setMessages]: [Message[], any] = useState([])
  const [answer, setAnswer]: [string, any] = useState('')
  const [ratingSubmitted, setRatingSubmitted]: [boolean, any] = useState(false)
  const ratings = ['Great', 'Good', 'Ok', 'Bad', 'Wrong']
  const refs: any = {}

  useEffect(() => {
    refs[messages.length - 1]?.focus()
  }, [messages])

  const fetchAnswer = async () => {
    setRatingSubmitted(false)
    setAnswer('Loading...')
    const res = await fetch('/api/wizard', {
      method: 'POST',
      body: JSON.stringify({ messages: messages }),
    })
    const data = await res.json()
    setAnswer(data.answer)
  }
  const submitRating = (rating: string) => {
    setRatingSubmitted(true)
  }
  return (
    <div className="flex flex-col w-full h-full my-8 items-center px-4">
      <h1 className="text-center font-bold text-6xl mb-5">Do They Like You?</h1>
      <h2 className="text-center text-2xl mb-5">
        Decipher their mixed signals and cryptic messages
      </h2>
      {/* <div className="max-w-[82] bg-[#2b2031] h-24 rounded-lg"></div> */}
      <div className="flex flex-col items-center w-96 px-4">
        <div className="border-[#32373e] border rounded-xl py-1 w-full">
          {messages.map((message, idx) => (
            <MessageView
              message={message}
              key={idx}
              inputRef={(input: any) => (refs[idx] = input)}
              onEnter={() =>
                idx == messages.length - 1 && message.message !== ''
                  ? setMessages([
                      ...messages,
                      {
                        from: message.from == 'you' ? 'them' : 'you',
                        message: '',
                      },
                    ])
                  : null
              }
              remove={() =>
                setMessages([
                  ...messages.slice(0, idx),
                  ...messages.slice(idx + 1, messages.length),
                ])
              }
              onChange={(e: any) =>
                setMessages(
                  Object.assign([], {
                    ...messages,
                    [idx]: { ...message, message: e.target.value },
                  })
                )
              }
            />
          ))}
          <div className="flex flex-row mx-2 mt-2 mb-1">
            {['you', 'them'].map((x) => (
              <p
                className={`flex-1 text-center rounded-lg py-1 mx-1 bg-[#32243d] hover:cursor-pointer`}
                key={x}
                onClick={() =>
                  setMessages([...messages, { from: x, message: '' }])
                }
              >
                + {x}
              </p>
            ))}
          </div>
        </div>
        <button
          className="flex-1 text-center rounded-lg p-3 my-5 ml-1 bg-[#32243d] w-11/12"
          onClick={fetchAnswer}
        >
          Find Out Their True Feelings...
        </button>
        {answer == 'Loading...' || answer == "Can't Tell" ? (
          <p className="font-bold text-4xl text-center">{answer}</p>
        ) : answer ? (
          <>
            <p className="mb-5 text-4xl text-center">
              They <span className="font-bold">{answer}</span> like you
            </p>
            {!ratingSubmitted && (
              <>
                <h3 className="text-2xl text-center mb-2">Rate this answer</h3>
                <div className="flex flex-row">
                  {ratings.map((x) => (
                    <p
                      key={x}
                      className="flex-1 text-center mx-1 py-1 px-2 border border-[#32373e] rounded-xl hover:cursor-pointer"
                      onClick={() => submitRating(x)}
                    >
                      {x}
                    </p>
                  ))}
                </div>
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  )
}
