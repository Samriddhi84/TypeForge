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

const modes: { id: TestMode; label: string }[] = [
  { id: "time", label: "Time" },
  { id: "words", label: "Words" },
  { id: "sentences", label: "Sentences" },
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
    accuracy,
    netWpm,
    rawWpm,
    correctCharacters,
    errorCount,
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
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6">
        {/* Navbar */}
        <header className="flex h-20 items-center justify-between">
          <button
            onClick={handleRestart}
            className="
    typeforge-logo
    text-[var(--text)]
    transition
    hover:text-[var(--accent)]
  "
          >
            TypeForge
          </button>

          <div className="relative">
            <button
              onClick={() => setThemeOpen((open) => !open)}
              className="
                flex
                items-center
                gap-2
                rounded-md
                px-3
                py-2
                text-sm
                text-[var(--muted)]
                transition
                hover:bg-[var(--surface)]
                hover:text-[var(--text)]
              "
            >
              <span>{themes.find((item) => item.id === theme)?.icon}</span>

              <span>{themes.find((item) => item.id === theme)?.name}</span>

              <span className="text-xs">⌄</span>
            </button>

            {themeOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-20
                  mt-2
                  w-44
                  rounded-lg
                  border
                  border-[var(--surface-hover)]
                  bg-[var(--surface)]
                  p-1.5
                  shadow-xl
                "
              >
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id);
                      setThemeOpen(false);
                    }}
                    className={`
                      flex
                      w-full
                      items-center
                      gap-2
                      rounded-md
                      px-3
                      py-2
                      text-sm
                      transition
                      ${
                        theme === themeOption.id
                          ? "bg-[var(--surface-hover)] text-[var(--text)]"
                          : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]"
                      }
                    `}
                  >
                    <span>{themeOption.icon}</span>
                    <span>{themeOption.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Main test area */}
        <section className="flex flex-1 flex-col justify-center pb-16">
          {status === "finished" ? (
            <Results
              wpm={netWpm}
              accuracy={accuracy}
              rawWpm={rawWpm}
              correctCharacters={correctCharacters}
              errorCount={errorCount}
              onRestart={handleRestart}
            />
          ) : (
            <div className="w-full">
              {/* Mode navigation */}
              <div className="mx-auto mb-2 flex w-full max-w-5xl items-center gap-6">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className={`
                      relative
                      py-2
                      text-sm
                      font-medium
                      transition
                      ${
                        testMode === mode.id
                          ? "text-[var(--text)]"
                          : "text-[var(--muted)] hover:text-[var(--text)]"
                      }
                    `}
                  >
                    {mode.label}

                    {testMode === mode.id && (
                      <span
                        className="
                          absolute
                          bottom-0
                          left-0
                          h-px
                          w-full
                          bg-[var(--accent)]
                        "
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Reserved controls area */}
              <div className="mx-auto flex h-14 w-full max-w-5xl items-start">
                {/* Time options */}
                {testMode === "time" && (
                  <div className="flex items-center gap-5">
                    {[15, 30, 60, 120].map((option) => (
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
                          text-sm
                          transition
                          ${
                            duration === option
                              ? "text-[var(--accent)]"
                              : "text-[var(--muted)] hover:text-[var(--text)]"
                          }
                        `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Word options */}
                {testMode === "words" && (
                  <div className="flex items-center gap-5">
                    {[25, 50, 100, 200].map((count) => (
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
                          text-sm
                          transition
                          ${
                            wordCount === count
                              ? "text-[var(--accent)]"
                              : "text-[var(--muted)] hover:text-[var(--text)]"
                          }
                        `}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stable typing layout */}
              <div
                onClick={focusTypingInput}
                className="
                  mx-auto
                  w-full
                  max-w-5xl
                  cursor-text
                "
              >
                {/* Timer / word counter slot */}
                <div className="mb-3 h-8">
                  {testMode === "time" && (
                    <div className="text-left text-2xl font-medium tracking-tight text-[var(--muted)]">
                      {timeLeft}
                    </div>
                  )}

                  {testMode === "words" && (
                    <div className="text-left text-2xl font-medium tracking-tight text-[var(--muted)]">
                      {wordsRemaining}
                    </div>
                  )}
                </div>

                {/* Typing text */}
                <TypingText text={passage} characters={characters} />

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
                    mt-10
                    rounded-md
                    px-4
                    py-2
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
