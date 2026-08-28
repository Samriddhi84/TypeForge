import { useEffect, useState } from 'react'

type CharacterStatus = 'correct' | 'incorrect' | 'untyped'
type TestStatus = 'not_started' | 'running' | 'finished'

function useTypingTest(text: string, duration: number) {
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(duration)
  const [status, setStatus] = useState<TestStatus>('not_started')
  const [elapsedTime, setElapsedTime] = useState(0)

  const [startTime, setStartTime] = useState<number | null>(null)

  const characters: CharacterStatus[] = text.split('').map((character, index) => {
    const typedCharacter = userInput[index]

    if (typedCharacter === undefined) {
      return 'untyped'
    }

    return typedCharacter === character ? 'correct' : 'incorrect'
  })

  const correctCharacters = characters.filter(
    (character) => character === 'correct',
  ).length

  const incorrectCharacters = characters.filter(
    (character) => character === 'incorrect',
  ).length

  const totalTypedCharacters = userInput.length

  const accuracy =
    totalTypedCharacters === 0
      ? 100
      : (correctCharacters / totalTypedCharacters) * 100

  const elapsedMinutes = elapsedTime / 60

  const rawWpm =
    elapsedMinutes > 0
      ? totalTypedCharacters / 5 / elapsedMinutes
      : 0

  const netWpm =
    elapsedMinutes > 0
      ? correctCharacters / 5 / elapsedMinutes
      : 0

  // Countdown timer
  useEffect(() => {
    if (status !== 'running') {
      return
    }

    const timer = setInterval(() => {
      if (startTime === null) {
        return
      }

      const elapsed = (Date.now() - startTime) / 1000
      const remaining = Math.max(duration - elapsed, 0)

      setElapsedTime(elapsed)
      setTimeLeft(Math.ceil(remaining))

      if (remaining <= 0) {
        setStatus('finished')
      }
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [status, startTime, duration])

  // Reset when duration changes
  useEffect(() => {
    setUserInput('')
    setTimeLeft(duration)
    setElapsedTime(0)
    setStartTime(null)
    setStatus('not_started')
  }, [duration])

  const finishTest = () => {
    if (startTime !== null) {
      const elapsed = (Date.now() - startTime) / 1000

      setElapsedTime(Math.min(elapsed, duration))
      setTimeLeft(Math.max(Math.ceil(duration - elapsed), 0))
    }

    setStatus('finished')
  }

  const handleInput = (value: string) => {
    if (status === 'finished') {
      return
    }

    if (value.length > text.length) {
      return
    }

    if (status === 'not_started' && value.length > 0) {
      const now = Date.now()

      setStartTime(now)
      setStatus('running')
    }

    setUserInput(value)

    if (value === text) {
      finishTest()
    }
  }

  const restartTest = () => {
    setUserInput('')
    setTimeLeft(duration)
    setElapsedTime(0)
    setStartTime(null)
    setStatus('not_started')
  }

  return {
    userInput,
    characters,
    timeLeft,
    status,
    elapsedTime,
    correctCharacters,
    incorrectCharacters,
    totalTypedCharacters,
    accuracy,
    rawWpm,
    netWpm,
    handleInput,
    restartTest,
  }
}

export default useTypingTest