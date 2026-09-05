import { useEffect, useState } from 'react'

type CharacterStatus = 'correct' | 'incorrect' | 'untyped'
type TestStatus = 'not_started' | 'running' | 'finished'
type TestMode = 'time' | 'words' | 'sentences'

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

  // Tracks mistakes made during the test, even if the user
  // later backspaces and corrects them.
  const [errorCount, setErrorCount] = useState(0)

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

      if (remaining <= 0) {
        setStatus('finished')
      }
    }, 100)

    return () => {
      clearInterval(timer)
    }
  }, [status, startTime, duration, testMode])

  // Reset when test configuration changes
  useEffect(() => {
    setUserInput('')
    setTimeLeft(duration)
    setElapsedTime(0)
    setStartTime(null)
    setStatus('not_started')
    setErrorCount(0)
  }, [duration, testMode, wordCount, text])

  const finishTest = () => {
    if (startTime !== null) {
      const elapsed = (Date.now() - startTime) / 1000

      setElapsedTime(elapsed)

      if (testMode === 'time') {
        setTimeLeft(Math.max(Math.ceil(duration - elapsed), 0))
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

    // Only check newly typed characters.
    // Backspacing does not remove previously recorded mistakes.
    if (value.length > userInput.length) {
      const typedCharacter = value[value.length - 1]
      const expectedCharacter = text[value.length - 1]

      if (typedCharacter !== expectedCharacter) {
        setErrorCount((count) => count + 1)
      }
    }

    setUserInput(value)

    // Time mode finishes when the timer reaches zero.
    // It can also finish early if the passage is completed.
    if (testMode === 'time' && value === text) {
      finishTest()
      return
    }

    // Words mode finishes when the selected word passage is completed.
    if (testMode === 'words' && value === text) {
      finishTest()
      return
    }

    // Sentences mode finishes when the sentence/passage is completed.
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
    errorCount,
    correctCharacters,
    incorrectCharacters,
    totalTypedCharacters,
    accuracy,
    rawWpm,
    netWpm,
    wordsTyped,
    wordsRemaining,
    handleInput,
    restartTest,
  }
}

export default useTypingTest
