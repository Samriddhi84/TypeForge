type ResultsProps = {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  correctCharacters: number;
  errorCount: number;
  onRestart: () => void;
};

function Results({
  wpm,
  accuracy,
  rawWpm,
  correctCharacters,
  errorCount,
  onRestart,
}: ResultsProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <div className="mb-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Test Complete
        </p>
      </div>

      <div className="mb-12 flex items-end gap-16">
        <div>
          <div className="text-6xl font-semibold tracking-tight text-[var(--accent)]">
            {wpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            WPM
          </div>
        </div>

        <div>
          <div className="text-6xl font-semibold tracking-tight text-[var(--text)]">
            {accuracy.toFixed(1)}%
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            Accuracy
          </div>
        </div>

        <div>
          <div className="text-6xl font-semibold tracking-tight text-[var(--text)]">
            {rawWpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            Raw WPM
          </div>
        </div>
      </div>

      <div className="mb-12 flex gap-8 text-sm">
        <div>
          <span className="text-[var(--text)]">
            {correctCharacters}
          </span>{" "}
          <span className="text-[var(--muted)]">
            correct
          </span>
        </div>

        <div>
          <span className="text-[var(--error)]">
            {errorCount}
          </span>{" "}
          <span className="text-[var(--muted)]">
            errors
          </span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="
          w-fit
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
        ↻ Try Again
      </button>
    </div>
  );
}

export default Results;