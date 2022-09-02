import { useState } from 'react'

const Response = () => {
  const [response, setResponse] = useState(null)

  const fetchResponse = async () => {
    const answer = await fetch('api/response')
    const data = await answer.json()
    console.log(data)
    setResponse(data.answer)
  }

  return (
    <div>
      <button onClick={fetchResponse}>Get Data</button>
      <div>{response}</div>
    </div>
  )
}

export default Response
