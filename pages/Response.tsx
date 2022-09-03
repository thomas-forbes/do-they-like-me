import { useState } from 'react'

const Response = () => {
  const [response, setResponse] = useState(null)

  const fetchResponse = async () => {
    const answer = await fetch('api/response')
    const data = await answer.json()
    setResponse(data.answer)
  }

  return (
    <div>
      <button
        className="flex-1 text-center rounded-lg p-3 my-5 ml-1 bg-[#2b2031]"
        onClick={fetchResponse}
      >
        Find Out Her True Feelings...
      </button>
      <div>{response}</div>
    </div>
  )
}

export default Response
