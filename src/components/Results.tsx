type WpmPoint = {
  time: number;
  wpm: number;
};

type ResultsProps = {
  wpm: number;
  accuracy: number;
  rawWpm: number;
  totalTypedCharacters: number;
  elapsedTime: number;
  errorCount: number;
  wpmHistory: WpmPoint[];
  onRestart: () => void;
};

function Results({
  wpm,
  accuracy,
  rawWpm,
  totalTypedCharacters,
  elapsedTime,
  errorCount,
  wpmHistory,
  onRestart,
}: ResultsProps) {
  const roundedTime = Math.round(elapsedTime);

  const graphWidth = 1000;
  const graphHeight = 260;

  const paddingLeft = 44;
  const paddingRight = 20;
  const paddingTop = 24;
  const paddingBottom = 32;

  const chartWidth =
    graphWidth - paddingLeft - paddingRight;

  const chartHeight =
    graphHeight - paddingTop - paddingBottom;

  const maxTime = Math.max(
    ...wpmHistory.map((point) => point.time),
    1,
  );

  const highestWpm = Math.max(
    ...wpmHistory.map((point) => point.wpm),
    1,
  );

  // Give the graph some breathing room above the fastest point.
  const maxGraphWpm =
    Math.ceil(highestWpm / 20) * 20 + 20;

  const getX = (time: number) => {
    return (
      paddingLeft +
      (time / maxTime) * chartWidth
    );
  };

  const getY = (value: number) => {
    return (
      paddingTop +
      chartHeight -
      (value / maxGraphWpm) * chartHeight
    );
  };

  const graphPoints = wpmHistory
    .map(
      (point) =>
        `${getX(point.time)},${getY(point.wpm)}`,
    )
    .join(" ");

  const yTicks = [
    maxGraphWpm,
    maxGraphWpm * 0.75,
    maxGraphWpm * 0.5,
    maxGraphWpm * 0.25,
    0,
  ];

  const xTicks = wpmHistory.filter((point) => {
    if (maxTime <= 5) {
      return true;
    }

    return (
      point.time === 1 ||
      point.time === Math.round(maxTime / 2) ||
      point.time === maxTime
    );
  });

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
        <div>
          <div className="text-7xl font-semibold tracking-tight text-[var(--accent)]">
            {wpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            WPM
          </div>
        </div>

        <div>
          <div className="text-7xl font-semibold tracking-tight text-[var(--text)]">
            {rawWpm.toFixed(0)}
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            Raw WPM
          </div>
        </div>

        <div>
          <div className="text-7xl font-semibold tracking-tight text-[var(--text)]">
            {accuracy.toFixed(1)}%
          </div>

          <div className="mt-2 text-sm text-[var(--muted)]">
            Accuracy
          </div>
        </div>
      </div>

      {/* Test summary */}
      <div className="mb-14 flex gap-10 text-sm">
        <div>
          <span className="text-[var(--text)]">
            {totalTypedCharacters}
          </span>{" "}
          <span className="text-[var(--muted)]">
            characters
          </span>
        </div>

        <div>
          <span className="text-[var(--error)]">
            {errorCount}
          </span>{" "}
          <span className="text-[var(--muted)]">
            {errorCount === 1 ? "error" : "errors"}
          </span>
        </div>

        <div>
          <span className="text-[var(--text)]">
            {roundedTime}s
          </span>{" "}
          <span className="text-[var(--muted)]">
            duration
          </span>
        </div>
      </div>

      {/* WPM Performance */}
      {wpmHistory.length > 0 && (
        <div className="mb-14">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">
              WPM Performance
            </span>

            <span className="text-xs text-[var(--muted)]">
              {wpmHistory.length}s tracked
            </span>
          </div>

          <div className="w-full overflow-hidden rounded-lg bg-[var(--surface)]">
            <svg
              viewBox={`0 0 ${graphWidth} ${graphHeight}`}
              className="block h-56 w-full"
              preserveAspectRatio="none"
            >
              {/* Grid */}
              {yTicks.map((value, index) => {
                const y = getY(value);

                return (
                  <g key={index}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={graphWidth - paddingRight}
                      y2={y}
                      stroke="var(--surface-hover)"
                      strokeWidth="1"
                      opacity={value === 0 ? 0.8 : 0.45}
                    />

                    <text
                      x="8"
                      y={y + 4}
                      fill="var(--muted)"
                      fontSize="11"
                    >
                      {Math.round(value)}
                    </text>
                  </g>
                );
              })}

              {/* Performance line */}
              <polyline
                points={graphPoints}
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Final point */}
              {wpmHistory.length > 0 && (
                <circle
                  cx={getX(
                    wpmHistory[wpmHistory.length - 1].time,
                  )}
                  cy={getY(
                    wpmHistory[wpmHistory.length - 1].wpm,
                  )}
                  r="5"
                  fill="var(--accent)"
                >
                  <title>
                    Final:{" "}
                    {wpmHistory[
                      wpmHistory.length - 1
                    ].wpm.toFixed(0)}{" "}
                    WPM
                  </title>
                </circle>
              )}

              {/* X-axis labels */}
              {xTicks.map((point) => (
                <text
                  key={point.time}
                  x={getX(point.time)}
                  y={graphHeight - 10}
                  fill="var(--muted)"
                  fontSize="11"
                  textAnchor="middle"
                >
                  {point.time}s
                </text>
              ))}
            </svg>
          </div>
        </div>
      )}

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