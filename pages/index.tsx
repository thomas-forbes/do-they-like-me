import splitbee from '@splitbee/web'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Message, ratings } from '../utils/types'

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
        onKeyUp={(e) =>
          e.code == 'Enter'
            ? onEnter()
            : e.code == 'Backspace' && message.message == ''
            ? remove()
            : null
        }
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
  const [messages, setMessages]: [Message[], any] = useState([
    { from: 'you', message: '' },
    { from: 'them', message: '' },
  ])
  const [prevMessageLen, setPrevMessageLen] = useState(2)
  const [answer, setAnswer]: [string, any] = useState('')
  const [ratingSubmitted, setRatingSubmitted]: [boolean, any] = useState(false)
  const [messageId, setMessageId]: [string, any] = useState('')

  const db = getFirestore()
  const refs: any = {}

  useEffect(() => {
    console.log(prevMessageLen, messages.length)
    if (prevMessageLen < messages.length) {
      refs[messages.length - 1]?.focus()
      setPrevMessageLen(messages.length)
    } else if (prevMessageLen > messages.length) {
      setPrevMessageLen(messages.length)
    }
    setAnswer('')
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

    if (data.answer == 'You have been rate limited') {
      splitbee.track('rateLimited')
    } else {
      const timestamp = Math.floor(Date.now() / 1000)

      let tMessageId = (
        await addDoc(collection(db, 'messages'), {
          message: messages,
          response: data.answer,
          timestamp: timestamp,
        })
      ).id
      setMessageId(tMessageId)

      splitbee.track('message', { id: tMessageId })
    }
  }

  const submitRating = (rating: string) => {
    setRatingSubmitted(true)
    updateDoc(doc(db, 'messages', messageId), {
      rating: rating,
    })
  }
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col w-full h-full my-8 items-center px-4">
        <h1 className="text-center font-bold text-6xl mb-5">
          Do They Like You?
        </h1>
        <h2 className="text-center text-2xl mb-5">
          Decipher their mixed signals and cryptic messages...
        </h2>
        <p className="text-center text-gray-400 mb-2 w-96 px-2">
          Enter a text message conversation below and find out whether they like
          you or not
        </p>
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
                    : refs[idx + 1]?.focus()
                }
                remove={() => {
                  setMessages([
                    ...messages.slice(0, idx),
                    ...messages.slice(idx + 1, messages.length),
                  ])
                  refs[idx - 1]?.focus()
                }}
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
            className="flex-1 text-center rounded-lg p-3 my-5 ml-1 bg-[#a4add3] text-black w-11/12"
            onClick={fetchAnswer}
          >
            Find Out Their True Feelings...
          </button>
          {answer == 'Loading...' ||
          answer == 'Unknown' ||
          answer == 'You have been rate limited' ? (
            <p className="font-bold text-4xl text-center">{answer}</p>
          ) : answer ? (
            <>
              <p className="mb-5 text-4xl text-center">
                They <span className="font-bold">{answer}</span> like you
              </p>
              {!ratingSubmitted ? (
                <>
                  <h3 className="text-2xl text-center mb-2">
                    Rate this answer
                  </h3>
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
              ) : (
                <p className="text-center text-1xl">
                  Thank you for your feedback :)
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col align-center self-center my-4">
        <a
          className="text-center text-2xl mb-2 font-bold underline"
          // target="_blank"
          href="https://www.buymeacoffee.com/thomasforbes"
          // rel="noopener"
          onClick={() => splitbee.track('buymeacoffee.com')}
        >
          Support Us!
        </a>
        <p className="text-gray-400 text-center">
          Built by{' '}
          <a
            href="https://thomasforbes.com/"
            className="underline"
            onClick={() => splitbee.track('thomasforbes.com')}
            // target="_blank"
            // rel="noopener"
          >
            Thomas Forbes
          </a>{' '}
          and{' '}
          <a
            href="https://willcarkner.com/"
            className="underline"
            onClick={() => splitbee.track('willcarkner.com')}
            // target="_blank"
            // rel="noopener"
          >
            Will Carkner
          </a>
          .{' '}
          <a
            className="underline"
            href={`mailto:relationships@thomasforbes.com${encodeURI(
              '?subject=I think I like you guys...&body=You are both just amazing... I want to get to know you more 😉'
            )}`}
            onClick={() => splitbee.track('single-no-more')}
          >
            Both single 😉
          </a>
        </p>
      </div>
    </div>
  )
}
