import { cn } from "@/lib/utils";

type OraklMarkProps = {
  className?: string;
  title?: string;
};

const nodes = [
  [7, 7.5],
  [16, 4],
  [25, 7.5],
  [7, 15.5],
  [16, 14.7],
  [25, 15.5],
  [16, 28],

  // Trophy base
  [10, 35],
  [22, 35],
] as const;

export function OraklMark({
  className,
  title = "Orakl",
}: OraklMarkProps) {
  return (
    <svg
      aria-label={title}
      className={cn("h-7 w-auto", className)}
      fill="none"
      height="38"
      role="img"
      viewBox="0 0 32 38"
      width="32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Existing network mark */}
      <path
        d="M7 7.5 16 4l9 3.5v8L16 28l-9-12.5v-8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />

      <path
        d="
          M7 7.5 16 14.7 25 7.5
          M16 4V14.7
          M7 15.5l9-.8 9 .8
          M16 14.7V28
        "
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />

      {/* Simple triangular trophy base */}
      <path
        d="M16 28 10 35h12L16 28Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />

      {/* Circular nodes */}
      {nodes.map(([cx, cy]) => (
        <circle
          cx={cx}
          cy={cy}
          fill="currentColor"
          key={`${cx}-${cy}`}
          r="2.2"
        />
      ))}
    </svg>
  );
}