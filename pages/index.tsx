import { initializeApp } from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore'
import { useState } from 'react'
import { Message, ratings } from '../utils/types'

const MessageView = ({
  message,
  onChange,
  remove,
}: {
  message: Message
  onChange: any
  remove: any
}) => {
  return (
    <div className="flex flex-row py-1 px-3 items-center w-full">
      <p className="flex-1 text-white">{message.from}:</p>
      <input
        type="text"
        placeholder="Message..."
        className="flex-[4] bg-black border-b border-[#32373e] focus:outline-none"
        value={message.message}
        onChange={onChange}
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
  const [messageId, setMessageId]: [string, any] = useState('')
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

  const fetchAnswer = async () => {
    setRatingSubmitted(false)
    setAnswer('Loading...')
    const res = await fetch('/api/wizard', {
      method: 'POST',
      body: JSON.stringify({ messages: messages }),
    })
    const data = await res.json()
    setAnswer(data.answer)

    setMessageId(
      await addDoc(collection(db, 'messages'), {
        message: messages,
        response: data.answer,
      }).id
    )
  }

  const submitRating = (rating: string) => {
    setRatingSubmitted(true)
    updateDoc(doc(db, 'messages', messageId), {
      rating: rating,
    })
  }
  return (
    <div className="flex flex-col w-full h-full my-8 items-center">
      <h1 className="text-center font-bold text-6xl mb-5">Do They Like You?</h1>
      <h2 className="text-center text-2xl mb-5">
        Decipher their mixed signals and cryptic messages...
      </h2>
      {/* <div className="max-w-[82] bg-[#2b2031] h-24 rounded-lg"></div> */}
      <div className="flex flex-col items-center w-96 px-4">
        <div className="border-[#32373e] border rounded-xl py-1 w-full">
          {messages.map((message, idx) => (
            <MessageView
              message={message}
              key={idx}
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
