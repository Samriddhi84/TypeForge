import { useEffect, useState } from 'react'

type CharacterStatus = 'correct' | 'incorrect' | 'untyped'
type TestStatus = 'not_started' | 'running' | 'finished'
type TestMode = 'time' | 'words' | 'sentences'

type WpmPoint = {
  time: number
  wpm: number
}

function useTypingTest(
  text: string,
  duration: number,
  testMode: TestMode,
  wordCount: number,
) {
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(duration)
  const [status, setStatus] = useState<TestStatus>('not_started')
  const [elapsedTime, setElapsedTime] = useState(0)

  const [startTime, setStartTime] = useState<number | null>(null)

  // Tracks every mistake made during the test.
  const [errorCount, setErrorCount] = useState(0)

  // Stores WPM performance throughout the test.
  const [wpmHistory, setWpmHistory] = useState<WpmPoint[]>([])

  const characters: CharacterStatus[] = text
    .split('')
    .map((character, index) => {
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

  const accurateCharacters = Math.max(
    totalTypedCharacters - errorCount,
    0,
  )

  const accuracy =
    totalTypedCharacters === 0
      ? 100
      : (accurateCharacters / totalTypedCharacters) * 100

  const elapsedMinutes = elapsedTime / 60

  const rawWpm =
    elapsedMinutes > 0
      ? totalTypedCharacters / 5 / elapsedMinutes
      : 0

  const netWpm =
    elapsedMinutes > 0
      ? accurateCharacters / 5 / elapsedMinutes
      : 0

  // Timer — only used for Time mode
  useEffect(() => {
    if (status !== 'running' || testMode !== 'time') {
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

      // Record WPM once per second.
      const currentElapsedSecond = Math.floor(elapsed)

      if (currentElapsedSecond > 0) {
        const currentWpm =
          elapsed > 0
            ? accurateCharacters / 5 / (elapsed / 60)
            : 0

        setWpmHistory((history) => {
          const lastPoint = history[history.length - 1]

          if (lastPoint?.time === currentElapsedSecond) {
            return history
          }

          return [
            ...history,
            {
              time: currentElapsedSecond,
              wpm: currentWpm,
            },
          ]
        })
      }

      if (remaining <= 0) {
        setStatus('finished')
      }
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [
    status,
    startTime,
    duration,
    testMode,
    accurateCharacters,
  ])

  // Reset when test configuration changes
  useEffect(() => {
    setUserInput('')
    setTimeLeft(duration)
    setElapsedTime(0)
    setStartTime(null)
    setStatus('not_started')
    setErrorCount(0)
    setWpmHistory([])
  }, [duration, testMode, wordCount, text])

  const finishTest = () => {
    if (startTime !== null) {
      const elapsed = (Date.now() - startTime) / 1000

      setElapsedTime(elapsed)

      if (testMode === 'time') {
        setTimeLeft(Math.max(Math.ceil(duration - elapsed), 0))
      }

      // Capture the final WPM point.
      if (elapsed > 0) {
        const finalWpm =
          accurateCharacters / 5 / (elapsed / 60)

        setWpmHistory((history) => {
          const finalTime = Math.max(1, Math.ceil(elapsed))

          const existingPoint = history.find(
            (point) => point.time === finalTime,
          )

          if (existingPoint) {
            return history.map((point) =>
              point.time === finalTime
                ? { time: finalTime, wpm: finalWpm }
                : point,
            )
          }

          return [
            ...history,
            {
              time: finalTime,
              wpm: finalWpm,
            },
          ]
        })
      }
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

    // Only inspect newly typed characters.
    // Backspacing does not remove previously recorded errors.
    if (value.length > userInput.length) {
      const typedCharacter = value[value.length - 1]
      const expectedCharacter = text[value.length - 1]

      if (typedCharacter !== expectedCharacter) {
        setErrorCount((count) => count + 1)
      }
    }

    setUserInput(value)

    // Time mode can finish when the passage is completed.
    if (testMode === 'time' && value === text) {
      finishTest()
      return
    }

    // Words mode finishes when the passage is completed.
    if (testMode === 'words' && value === text) {
      finishTest()
      return
    }

    // Sentences mode finishes when the passage is completed.
    if (testMode === 'sentences' && value === text) {
      finishTest()
    }
  }

  const restartTest = () => {
    setUserInput('')
    setTimeLeft(duration)
    setElapsedTime(0)
    setStartTime(null)
    setStatus('not_started')
    setErrorCount(0)
    setWpmHistory([])
  }

  const wordsTyped =
    userInput.trim() === ''
      ? 0
      : userInput.trim().split(/\s+/).length

  const wordsRemaining = Math.max(wordCount - wordsTyped, 0)

  return {
    userInput,
    characters,
    timeLeft,
    status,
    elapsedTime,

    correctCharacters,
    incorrectCharacters,
    totalTypedCharacters,
    errorCount,

    accuracy,
    rawWpm,
    netWpm,

    wordsTyped,
    wordsRemaining,

    wpmHistory,

    handleInput,
    restartTest,
  }
}

export default useTypingTest