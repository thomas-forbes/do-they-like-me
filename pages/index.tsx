import Response from './Response'

const Question = () => {
  return (
    <div className="flex flex-row py-1 px-3 items-center">
      <p className="flex-1 text-white mr-2">You:</p>
      <input
        type="text"
        placeholder="Ask her anything..."
        className="flex-3 bg-black border-b border-[#32373e]"
      ></input>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full my-8 items-center">
      <h1 className="text-center font-bold text-6xl mb-5">Is She Into You?</h1>
      <h2 className="text-center text-2xl mb-5">
        GPT-3 can decide if she is into you, based on a text conversation you
        have had!
      </h2>
      {/* <div className="max-w-[82] bg-[#2b2031] h-24 rounded-lg"></div> */}
      <div className="border-[#32373e] border rounded-xl py-1">
        <Question />
        <Question />
        <div className="flex flex-row mx-2">
          {/* MAKE BG SWITCH FROM ACTIVE (PURPLE) to not active (grey) based on last added */}
          <p className="flex-1 text-center rounded-lg py-1 mr-1 bg-[#32243d]">
            + You
          </p>
          <p className="flex-1 text-center rounded-lg py-1 ml-1 bg-[#2b2031]">
            + Them
          </p>
        </div>
      </div>
      <Response />
    </div>
  )
}
