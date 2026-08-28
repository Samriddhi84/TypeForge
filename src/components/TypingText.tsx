import { useEffect, useRef } from "react";

type CharacterStatus = "correct" | "incorrect" | "untyped";

type TypingTextProps = {
  text: string;
  characters: CharacterStatus[];
};

function TypingText({ text, characters }: TypingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentCharacterRef = useRef<HTMLSpanElement>(null);

  const currentIndex = characters.findIndex(
    (characterStatus) => characterStatus === "untyped",
  );

  useEffect(() => {
    const container = containerRef.current;
    const currentCharacter = currentCharacterRef.current;

    if (!container || !currentCharacter || currentIndex === -1) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const characterRect = currentCharacter.getBoundingClientRect();

    const characterTop =
      characterRect.top - containerRect.top + container.scrollTop;

    const characterBottom =
      characterRect.bottom - containerRect.top + container.scrollTop;

    const visibleTop = container.scrollTop;
    const visibleBottom = visibleTop + container.clientHeight;

    if (characterBottom > visibleBottom) {
      container.scrollTop = characterTop - container.clientHeight / 2;
    }

    if (characterTop < visibleTop) {
      container.scrollTop = Math.max(
        0,
        characterTop - container.clientHeight / 2,
      );
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="
        h-[10rem]
        w-full
        overflow-hidden
        text-left
        font-mono
        text-2xl
        leading-relaxed
        tracking-wide
        whitespace-pre-wrap
      "
    >
      {text.split("").map((character, index) => {
        const status = characters[index];

        let colorClass = "text-[var(--muted)]";

        if (status === "correct") {
          colorClass = "text-[var(--text)]";
        }

        if (status === "incorrect") {
          colorClass = "text-[var(--error)]";
        }

        const isCurrent = index === currentIndex;

        return (
          <span
            key={index}
            ref={isCurrent ? currentCharacterRef : null}
            className={`
              ${colorClass}
              ${
                isCurrent
                  ? "border-b-2 border-[var(--accent)]"
                  : ""
              }
              ${
                status === "incorrect" && character === " "
                  ? "border-b-2 border-[var(--error)]"
                  : ""
              }
            `}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
}

export default TypingText;