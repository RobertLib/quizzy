const TONE: Record<string, string> = {
  g: "bg-ok",
  y: "bg-warn",
  r: "bg-bad",
};

/** A result grid as squares that never wrap, unlike emoji in narrow columns. */
export default function GridSquares({
  grid,
  size = "sm",
}: {
  grid: string;
  size?: "sm" | "lg";
}) {
  const correct = [...grid].filter((c) => c === "g").length;
  return (
    <div
      role="img"
      aria-label={`${correct} of ${grid.length} correct`}
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
