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
      {/* Heading */}
      <div className="mb-14">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Test Complete
        </p>
      </div>

      {/* Main statistics */}
      <div className="mb-14 flex items-end gap-20">
        {/* WPM */}
        <div>
          <div className="text-7xl font-semibold tracking-tight text-[var(--accent)]">
            {wpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">WPM</div>
        </div>

        {/* Raw WPM */}
        <div>
          <div className="text-7xl font-semibold tracking-tight text-[var(--text)]">
            {rawWpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">Raw WPM</div>
        </div>

        {/* Accuracy */}
        <div>
          <div className="text-7xl font-semibold tracking-tight text-[var(--text)]">
            {accuracy.toFixed(1)}%
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">Accuracy</div>
        </div>
      </div>

      {/* Secondary statistics */}
      <div className="mb-14 flex gap-10 text-sm">
        <div>
          <span className="text-[var(--text)]">{correctCharacters}</span>{" "}
          <span className="text-[var(--muted)]">correct</span>
        </div>

        <div>
          <span className="text-[var(--error)]">{errorCount}</span>{" "}
          <span className="text-[var(--muted)]">
            {errorCount === 1 ? "error" : "errors"}
          </span>
        </div>
      </div>

      {/* Restart */}
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
