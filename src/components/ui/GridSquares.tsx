const TONE: Record<string, string> = {
  g: "bg-ok",
  y: "bg-warn",
  r: "bg-bad",
};

/** A result grid as squares that never wrap, unlike emoji in narrow columns. */
export default function GridSquares({
  grid,
  label,
  size = "sm",
}: {
  grid: string;
  /** What a screen reader says instead, e.g. "6 of 8 correct". */
  label: string;
  size?: "sm" | "lg";
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex justify-center ${size === "lg" ? "gap-1.5" : "gap-0.5"}`}
    >
      {[...grid].map((c, i) => (
        <span
          key={i}
          className={`${TONE[c] ?? "bg-line"} ${
            size === "lg" ? "size-7 rounded-md sm:size-8" : "size-3.5 rounded-[3px]"
          }`}
        />
      ))}
    </div>
  );
}
