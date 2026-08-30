import { useRef, useState } from "react";
import TypingText from "./components/TypingText";
import useTypingTest from "./hooks/useTypingTest";
import { passages } from "./data/passage";
import { generateText } from "./utils/generateText";
import Results from "./components/Results";

type Theme = "midnight" | "daylight" | "sakura";
type TestMode = "time" | "words" | "sentences";

const themes: { id: Theme; name: string; icon: string }[] = [
  { id: "midnight", name: "Midnight", icon: "🌑" },
  { id: "daylight", name: "Daylight", icon: "☀️" },
  { id: "sakura", name: "Sakura", icon: "🌸" },
];

function App() {
  const [theme, setTheme] = useState<Theme>("midnight");
  const [themeOpen, setThemeOpen] = useState(false);
  const [duration, setDuration] = useState(60);
  const [testMode, setTestMode] = useState<TestMode>("time");
  const [wordCount, setWordCount] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);

  const [passage, setPassage] = useState(
    () => passages[Math.floor(Math.random() * passages.length)],
  );

  const generatePassage = (mode: TestMode, count = wordCount) => {
    if (mode === "sentences") {
      return passages[Math.floor(Math.random() * passages.length)];
    }

    return generateText(count);
  };

  const {
    userInput,
    characters,
    timeLeft,
    status,
    elapsedTime,
    accuracy,
    netWpm,
    correctCharacters,
    incorrectCharacters,
    handleInput,
    restartTest,
    wordsRemaining,
  } = useTypingTest(passage, duration, testMode, wordCount);

  const focusTypingInput = () => {
    inputRef.current?.focus();
  };

  const handleModeChange = (mode: TestMode) => {
    setTestMode(mode);
    setPassage(generatePassage(mode));
    restartTest();

    setTimeout(() => {
      focusTypingInput();
    }, 0);
  };

  const handleRestart = () => {
    setPassage(generatePassage(testMode));
    restartTest();

    setTimeout(() => {
      focusTypingInput();
    }, 0);
  };

  return (
    <main className={`min-h-screen theme-${theme}`}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">

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
                      setTheme(themeOption.id);
                      setThemeOpen(false);
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

          {status === "finished" ? (
            /* Results */
            <Results
              wpm={netWpm}
              accuracy={accuracy}
              correctCharacters={correctCharacters}
              incorrectCharacters={incorrectCharacters}
              onRestart={handleRestart}
            />
          ) : (
            /* Typing Test */
            <div className="w-full">

              {/* Test mode */}
              <div className="mb-5 flex justify-center gap-2">
                {(["time", "words", "sentences"] as TestMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`
                      rounded-lg
                      px-4 py-2
                      text-sm
                      transition
                      ${
                        testMode === mode
                          ? "bg-[var(--accent)] text-[var(--bg)]"
                          : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                      }
                    `}
                  >
                    {mode === "time"
                      ? "Time"
                      : mode === "words"
                        ? "Words"
                        : "Sentences"}
                  </button>
                ))}
              </div>

              {/* Mode options */}
              <div className="mb-8 flex min-h-10 justify-center gap-2">

                {/* Time options */}
                {testMode === "time" &&
                  [15, 30, 60, 120].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setDuration(option);
                        restartTest();

                        setTimeout(() => {
                          focusTypingInput();
                        }, 0);
                      }}
                      className={`
                        rounded-lg
                        px-4 py-2
                        text-sm
                        transition
                        ${
                          duration === option
                            ? "bg-[var(--accent)] text-[var(--bg)]"
                            : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                        }
                      `}
                    >
                      {option}s
                    </button>
                  ))}

                {/* Word options */}
                {testMode === "words" &&
                  [25, 50, 100, 200].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setWordCount(count);
                        setPassage(generatePassage("words", count));
                        restartTest();

                        setTimeout(() => {
                          focusTypingInput();
                        }, 0);
                      }}
                      className={`
                        rounded-lg
                        px-4 py-2
                        text-sm
                        transition
                        ${
                          wordCount === count
                            ? "bg-[var(--accent)] text-[var(--bg)]"
                            : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                        }
                      `}
                    >
                      {count}
                    </button>
                  ))}
              </div>

              {/* Typing area */}
              <div
                onClick={focusTypingInput}
                className="mx-auto w-full max-w-5xl cursor-text outline-none"
              >

                {/* Time / Word counter */}
                {testMode !== "sentences" && (
                  <div className="mb-6 text-left text-2xl font-medium text-[var(--muted)]">
                    {testMode === "time" ? timeLeft : wordsRemaining}
                  </div>
                )}

                {/* Stable typing area */}
                <div className="h-[10rem] overflow-hidden">
                  <TypingText
                    text={passage}
                    characters={characters}
                  />
                </div>

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
              <div className="flex justify-center">
                <button
                  onClick={handleRestart}
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
              </div>

            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;