type ResultsProps = {
  wpm: number
  accuracy: number
  correctCharacters: number
  incorrectCharacters: number
  onRestart: () => void
}

function Results({
  wpm,
  accuracy,
  correctCharacters,
  incorrectCharacters,
  onRestart,
}: ResultsProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <p className="mb-8 text-sm font-medium uppercase tracking-widest text-[var(--muted)]">
        Test Complete
      </p>

      <div className="mb-10 flex items-end gap-12">
        <div>
          <div className="text-5xl font-semibold tracking-tight text-[var(--accent)]">
            {wpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            WPM
          </div>
        </div>

        <div>
          <div className="text-5xl font-semibold tracking-tight text-[var(--text)]">
            {accuracy.toFixed(1)}%
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            Accuracy
          </div>
        </div>
      </div>

      <div className="mb-10 flex gap-8 text-sm">
        <div>
          <span className="text-[var(--text)]">
            {correctCharacters}
          </span>{' '}
          <span className="text-[var(--muted)]">
            correct
          </span>
        </div>

        <div>
          <span className="text-[var(--error)]">
            {incorrectCharacters}
          </span>{' '}
          <span className="text-[var(--muted)]">
            incorrect
          </span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="
          rounded-lg
          bg-[var(--surface)]
          px-5 py-2.5
          text-sm
          text-[var(--text)]
          transition
          hover:bg-[var(--surface-hover)]
        "
      >
        ↻ Try Again
      </button>
    </div>
  )
}

export default Results