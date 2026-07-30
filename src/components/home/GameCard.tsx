import Link from "next/link";
import type { ActiveGame } from "./home.types";
import GameCardEnergy  from "./GameCardEnergy";

type GameCardProps = {
  name: string;
  description: string;
  href: string;
  product: Exclude<ActiveGame, null>;
  label?: string;
  active: boolean;
  onActiveChange: (game: ActiveGame) => void;
};

export function GameCard({
  name,
  description,
  href,
  product,
  label,
  active,
  onActiveChange,
}: GameCardProps) {
  return (
    <Link
      href={href}
      data-product={product}
      data-active={active || undefined}
      onMouseEnter={() => onActiveChange(product)}
      onMouseLeave={() => onActiveChange(null)}
      onFocus={() => onActiveChange(product)}
      onBlur={() => onActiveChange(null)}
      className={[
        "group relative flex min-h-96 flex-col overflow-hidden rounded-2xl border p-8",
        "bg-card shadow-sm",
        "transition-[transform,background-color,border-color,box-shadow] duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:bg-accent hover:shadow-md",
        "focus-visible:-translate-y-1 focus-visible:border-primary/40 focus-visible:bg-accent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      ].join(" ")}
    >
      <GameCardEnergy active={active} />
      
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-75 bg-primary transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground transition-colors duration-300 group-hover:text-accent-foreground group-focus-visible:text-accent-foreground">
          {label ?? "Prediction game"}
        </span>

        <span className="size-3 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125" />
      </div>

      <div className="mt-auto">
        <h3 className="text-3xl font-semibold tracking-tight">{name}</h3>

        <p className="mt-4 max-w-md leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground">
          {description}
        </p>

        <span className="mt-8 inline-flex font-semibold text-primary">
          Enter game
          <span
            aria-hidden="true"
            className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-focus-visible:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}