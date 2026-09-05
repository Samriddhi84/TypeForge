import { useEffect, useRef, useState } from "react";

type CharacterStatus = "correct" | "incorrect" | "untyped";
type TestStatus = "not_started" | "running" | "finished";
type TestMode = "time" | "words" | "sentences";

export type WpmPoint = {
  time: number;
  wpm: number;
};

function useTypingTest(
  text: string,
  duration: number,
  testMode: TestMode,
  wordCount: number,
) {
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState<TestStatus>("not_started");
  const [elapsedTime, setElapsedTime] = useState(0);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<WpmPoint[]>([]);

  const userInputRef = useRef("");
  const errorCountRef = useRef(0);
  const wpmHistoryRef = useRef<WpmPoint[]>([]);

  const characters: CharacterStatus[] = text
    .split("")
    .map((character, index) => {
      const typedCharacter = userInput[index];

      if (typedCharacter === undefined) {
        return "untyped";
      }

      return typedCharacter === character ? "correct" : "incorrect";
    });

  const correctCharacters = characters.filter(
    (character) => character === "correct",
  ).length;

  const incorrectCharacters = characters.filter(
    (character) => character === "incorrect",
  ).length;

  const totalTypedCharacters = userInput.length;

  const accurateCharacters = Math.max(totalTypedCharacters - errorCount, 0);

  const accuracy =
    totalTypedCharacters === 0
      ? 100
      : (accurateCharacters / totalTypedCharacters) * 100;

  const elapsedMinutes = elapsedTime / 60;

  const rawWpm =
    elapsedMinutes > 0 ? totalTypedCharacters / 5 / elapsedMinutes : 0;

  const netWpm =
    elapsedMinutes > 0 ? accurateCharacters / 5 / elapsedMinutes : 0;

  // Keep the latest typing data available to the performance tracker.
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    errorCountRef.current = errorCount;
  }, [errorCount]);

  /*
   * Performance tracker
   *
   * This runs for ALL test modes.
   *
   * Time mode additionally updates the countdown.
   * Words and Sentences simply use this interval to track elapsed time
   * and WPM until the test is completed.
   */
  useEffect(() => {
    if (status !== "running" || startTime === null) {
      return;
    }

    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;

      setElapsedTime(elapsed);

      // Countdown is only relevant to Time mode.
      if (testMode === "time") {
        const remaining = Math.max(duration - elapsed, 0);

        setTimeLeft(Math.ceil(remaining));

        if (remaining <= 0) {
          setStatus("finished");
          return;
        }
      }

      // Record one WPM point per second.
      const second = Math.floor(elapsed);

      if (second <= 0) {
        return;
      }

      const typedCharacters = userInputRef.current.length;
      const errors = errorCountRef.current;

      const accurate = Math.max(typedCharacters - errors, 0);

      const currentWpm = elapsed > 0 ? accurate / 5 / (elapsed / 60) : 0;

      if (!wpmHistoryRef.current.some((point) => point.time === second)) {
        const newPoint: WpmPoint = {
          time: second,
          wpm: currentWpm,
        };

        wpmHistoryRef.current = [...wpmHistoryRef.current, newPoint];

        setWpmHistory([...wpmHistoryRef.current]);
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [status, startTime, duration, testMode]);

  // Reset when test configuration changes.
  useEffect(() => {
    setUserInput("");
    setTimeLeft(duration);
    setElapsedTime(0);
    setStartTime(null);
    setStatus("not_started");
    setErrorCount(0);
    setWpmHistory([]);

    userInputRef.current = "";
    errorCountRef.current = 0;
    wpmHistoryRef.current = [];
  }, [duration, testMode, wordCount, text]);

  const finishTest = () => {
    if (startTime !== null) {
      const elapsed = (Date.now() - startTime) / 1000;

      setElapsedTime(elapsed);

      if (testMode === "time") {
        setTimeLeft(Math.max(Math.ceil(duration - elapsed), 0));
      }

      const typedCharacters = userInputRef.current.length;
      const errors = errorCountRef.current;

      const accurate = Math.max(typedCharacters - errors, 0);

      /*
       * Always capture the final WPM point.
       *
       * This is particularly important for Words and Sentences,
       * because they can finish between two one-second intervals.
       */
      if (elapsed > 0) {
        const finalWpm = accurate / 5 / (elapsed / 60);

        const finalSecond = Math.max(1, Math.ceil(elapsed));

        const finalPoint: WpmPoint = {
          time: finalSecond,
          wpm: finalWpm,
        };

        const existingIndex = wpmHistoryRef.current.findIndex(
          (point) => point.time === finalSecond,
        );

        if (existingIndex >= 0) {
          wpmHistoryRef.current = wpmHistoryRef.current.map((point, index) =>
            index === existingIndex ? finalPoint : point,
          );
        } else {
          wpmHistoryRef.current = [...wpmHistoryRef.current, finalPoint];
        }

        setWpmHistory([...wpmHistoryRef.current]);
      }
    }

    setStatus("finished");
  };

  const handleInput = (value: string) => {
    if (status === "finished") {
      return;
    }

    if (value.length > text.length) {
      return;
    }

    // Start the test on the first typed character.
    if (status === "not_started" && value.length > 0) {
      const now = Date.now();

      setStartTime(now);
      setStatus("running");
    }

    /*
     * Count every newly typed incorrect character.
     *
     * Backspacing does not erase historical errors.
     */
    if (value.length > userInput.length) {
      const typedCharacter = value[value.length - 1];
      const expectedCharacter = text[value.length - 1];

      if (typedCharacter !== expectedCharacter) {
        setErrorCount((count) => {
          const nextCount = count + 1;

          errorCountRef.current = nextCount;

          return nextCount;
        });
      }
    }

    userInputRef.current = value;
    setUserInput(value);

    // Time mode finishes when the passage is completed.
    if (testMode === "time" && value === text) {
      finishTest();
      return;
    }

    // Words mode finishes when the selected passage is completed.
    if (testMode === "words") {
      const targetWords = text.trim().split(/\s+/).slice(0, wordCount);

      const targetText = targetWords.join(" ");

      if (value.length >= targetText.length) {
        finishTest();
        return;
      }
    }

    // Sentences mode finishes when the complete passage has been typed.
    if (testMode === "sentences" && value.length >= text.trim().length) {
      finishTest();
    }
  };

  const restartTest = () => {
    setUserInput("");
    setTimeLeft(duration);
    setElapsedTime(0);
    setStartTime(null);
    setStatus("not_started");
    setErrorCount(0);
    setWpmHistory([]);

    userInputRef.current = "";
    errorCountRef.current = 0;
    wpmHistoryRef.current = [];
  };

  const wordsTyped =
    userInput.trim() === "" ? 0 : userInput.trim().split(/\s+/).length;

  const wordsRemaining = Math.max(wordCount - wordsTyped, 0);

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
  };
}

export default useTypingTest;
