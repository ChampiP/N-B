import { useState } from 'react'
import Envelope from './components/Envelope/Envelope'
import LandingPage from './components/LandingPage/LandingPage'
import './App.css'

function App() {
  const [showLanding, setShowLanding] = useState(false)

  const handleContinue = () => {
    setShowLanding(true)
  }

  return (
    <div className="app">
      {!showLanding ? (
        <Envelope onContinue={handleContinue} />
      ) : (
        <LandingPage />
      )}
    </div>
  )
}

export default App
