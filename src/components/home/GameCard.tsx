import Link from "next/link";

type GameCardProps = {
  name: string;
  description: string;
  href: string;
  product: "predictor" | "faux-stakes";
  label?: string;
};

export function GameCard({
  name,
  description,
  href,
  product,
  label,
}: GameCardProps) {
  return (
    <Link
      href={href}
      data-product={product}
      className="group relative flex min-h-96 flex-col overflow-hidden rounded-2xl border bg-card p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label ?? "Prediction game"}
        </span>

        <span className="size-3 rounded-full bg-primary" />
      </div>

      <div className="mt-auto">
        <h3 className="text-3xl font-semibold tracking-tight">{name}</h3>

        <p className="mt-4 max-w-md leading-7 text-muted-foreground">
          {description}
        </p>

        <span className="mt-8 inline-flex font-semibold text-primary">
          Enter game
          <span aria-hidden="true" className="ml-2">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}