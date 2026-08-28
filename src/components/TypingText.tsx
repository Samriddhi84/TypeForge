type CharacterStatus = "correct" | "incorrect" | "untyped";

type TypingTextProps = {
  text: string;
  characters: CharacterStatus[];
};

function TypingText({ text, characters }: TypingTextProps) {
  const currentIndex = characters.findIndex(
    (characterStatus) => characterStatus === "untyped",
  );

  const lastTypedIndex =
    currentIndex === -1 ? characters.length - 1 : currentIndex - 1;

  return (
    <div className="w-full max-w-3xl text-center font-mono text-xl leading-relaxed tracking-wide whitespace-pre-wrap">
      {text.split("").map((character, index) => {
        const status = characters[index];

        let colorClass = "text-[var(--muted)]";

        if (status === "correct") {
          colorClass = "text-[var(--text)]";
        }

        if (status === "incorrect") {
          colorClass = "text-[var(--error)]";
        }

        return (
          <span
            key={index}
            className={`
    ${colorClass}
    ${index === currentIndex ? "border-b-2 border-[var(--accent)]" : ""}
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
