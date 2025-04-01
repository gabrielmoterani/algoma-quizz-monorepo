import logo from '../assets/logo.png'

function StartGameSlide(): JSX.Element {
  return (
    <div className="flex flex-col h-full min-h-[500px] text-center justify-center items-center">
      <div className="w-full max-w-3xl">
        <img src={logo} alt="logo" className="h-16 mx-auto mb-8" />
        <h2 className="text-3xl font-bold text-center mb-8">Welcome to the game</h2>
        <p className="text-lg text-center mb-8">
          This is a game that challenges the students to answer questions for a chance to win a
          prize.
        </p>
      </div>
    </div>
  )
}

export default StartGameSlide
