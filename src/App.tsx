import { useRef, useState } from 'react'
import TypingText from './components/TypingText'
import useTypingTest from './hooks/useTypingTest'
import { passages } from './data/passage'
import { generateText } from './utils/generateText'
import Results from './components/Results'

type Theme = 'midnight' | 'daylight' | 'sakura'
type TestMode = 'sentences' | 'words'

const themes: { id: Theme; name: string; icon: string }[] = [
  { id: 'midnight', name: 'Midnight', icon: '🌑' },
  { id: 'daylight', name: 'Daylight', icon: '☀️' },
  { id: 'sakura', name: 'Sakura', icon: '🌸' },
]

function App() {
  const [theme, setTheme] = useState<Theme>('midnight')
  const [themeOpen, setThemeOpen] = useState(false)
  const [duration, setDuration] = useState(60)
  const [testMode, setTestMode] = useState<TestMode>('sentences')

  const inputRef = useRef<HTMLInputElement>(null)

  const [passage, setPassage] = useState(() => generateText(100))

  const {
    userInput,
    characters,
    timeLeft,
    status,
    elapsedTime,
    accuracy,
    rawWpm,
    netWpm,
    correctCharacters,
    incorrectCharacters,
    handleInput,
    restartTest,
  } = useTypingTest(passage, duration)

  const focusTypingInput = () => {
    inputRef.current?.focus()
  }

  return (
    <main className={`min-h-screen theme-${theme}`}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-[var(--surface)] pb-5">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--text)]">
            TypeForge
          </h1>

          {/* Theme selector */}
          <div className="relative">
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              className="
                rounded-lg
                bg-[var(--surface)]
                px-3 py-2
                text-sm
                text-[var(--text)]
                transition
                hover:bg-[var(--surface-hover)]
              "
            >
              Theme
            </button>

            {themeOpen && (
              <div
                className="
                  absolute
                  right-0
                  z-10
                  mt-2
                  w-44
                  rounded-xl
                  border
                  border-[var(--surface-hover)]
                  bg-[var(--surface)]
                  p-2
                  shadow-lg
                "
              >
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id)
                      setThemeOpen(false)
                    }}
                    className="
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-lg
                      px-3 py-2
                      text-sm
                      text-[var(--text)]
                      transition
                      hover:bg-[var(--surface-hover)]
                    "
                  >
                    <span>{themeOption.icon}</span>
                    <span>{themeOption.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <section className="flex flex-1 flex-col items-center justify-center">

          {status === 'finished' ? (
            /* Results */
            <div className="w-full max-w-2xl text-center">
              <p className="mb-3 text-sm text-[var(--muted)]">
                Test complete
              </p>

              <div className="mb-12">
                <div className="text-7xl font-semibold tracking-tight text-[var(--accent)]">
                  {Math.round(netWpm)}
                </div>

                <div className="mt-2 text-lg text-[var(--muted)]">
                  WPM
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl bg-[var(--surface)] p-5">
                  <div className="text-2xl font-semibold text-[var(--text)]">
                    {accuracy.toFixed(1)}%
                  </div>

                  <div className="mt-1 text-sm text-[var(--muted)]">
                    Accuracy
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-5">
                  <div className="text-2xl font-semibold text-[var(--text)]">
                    {correctCharacters}
                  </div>

                  <div className="mt-1 text-sm text-[var(--muted)]">
                    Correct
                  </div>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-5">
                  <div className="text-2xl font-semibold text-[var(--text)]">
                    {incorrectCharacters}
                  </div>

                  <div className="mt-1 text-sm text-[var(--muted)]">
                    Errors
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm text-[var(--muted)]">
                Time: {elapsedTime.toFixed(1)}s
              </div>

              <button
                onClick={() => {
                  restartTest()

                  setTimeout(() => {
                    focusTypingInput()
                  }, 0)
                }}
                className="
                  mt-10
                  rounded-lg
                  bg-[var(--surface)]
                  px-5 py-3
                  text-sm
                  text-[var(--text)]
                  transition
                  hover:bg-[var(--surface-hover)]
                "
              >
                ↻ Try Again
              </button>
            </div>
          ) : (
            /* Typing Test */
            <>
              {/* Test mode */}
              <div className="mb-6 flex gap-2">
                <button
                  onClick={() => setTestMode('sentences')}
                  className={`
                    rounded-lg
                    px-4 py-2
                    text-sm
                    transition
                    ${
                      testMode === 'sentences'
                        ? 'bg-[var(--accent)] text-[var(--bg)]'
                        : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                    }
                  `}
                >
                  Sentences
                </button>

                <button
                  onClick={() => setTestMode('words')}
                  className={`
                    rounded-lg
                    px-4 py-2
                    text-sm
                    transition
                    ${
                      testMode === 'words'
                        ? 'bg-[var(--accent)] text-[var(--bg)]'
                        : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                    }
                  `}
                >
                  Words
                </button>
              </div>

              {/* Duration options */}
              <div className="mb-8 flex gap-2">
                {[15, 30, 60, 120].map((option) => (
                  <button
                    key={option}
                    onClick={() => setDuration(option)}
                    className={`
                      rounded-lg
                      px-4 py-2
                      text-sm
                      transition
                      ${
                        duration === option
                          ? 'bg-[var(--accent)] text-[var(--bg)]'
                          : 'text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]'
                      }
                    `}
                  >
                    {option}s
                  </button>
                ))}
              </div>

              {/* Timer */}
              <div className="mb-10 text-2xl font-medium text-[var(--muted)]">
                {timeLeft}
              </div>

              {/* Typing area */}
              <div
                onClick={focusTypingInput}
                className="relative cursor-text outline-none"
              >
                <TypingText
                  text={passage}
                  characters={characters}
                />

                <input
                  ref={inputRef}
                  value={userInput}
                  onChange={(event) => handleInput(event.target.value)}
                  className="absolute h-0 w-0 opacity-0"
                  aria-label="Typing input"
                  autoFocus
                />
              </div>

              {/* Restart */}
              <button
                onClick={() => {
                  setPassage(
                    passages[Math.floor(Math.random() * passages.length)],
                  )

                  restartTest()

                  setTimeout(() => {
                    focusTypingInput()
                  }, 0)
                }}
                className="
                  mt-12
                  rounded-lg
                  px-4 py-2
                  text-sm
                  text-[var(--muted)]
                  transition
                  hover:bg-[var(--surface)]
                  hover:text-[var(--text)]
                "
              >
                ↻ Restart
              </button>
            </>
          )}
        </section>
      </div>
    </main>
  )
}

export default App