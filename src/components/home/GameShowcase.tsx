import { GameCard } from "./GameCard";
import type { ActiveGame } from "./home.types";

type GameShowcaseProps = {
  activeGame: ActiveGame;
  onActiveGameChange: (game: ActiveGame) => void;
};

export function GameShowcase({
  activeGame,
  onActiveGameChange,
}: GameShowcaseProps) {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Games
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose how you want to compete.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <GameCard
            name="Predictor"
            description="Make your calls, follow the action and compete against the people who know you best."
            href="/predictor"
            product="predictor"
            active={activeGame === "predictor"}
            onActiveChange={onActiveGameChange}
          />

          <GameCard
            name="Faux Stakes"
            description="Create markets around the moments that matter and prove who really knows what happens next."
            href="/faux-stakes"
            product="faux-stakes"
            active={activeGame === "faux-stakes"}
            onActiveChange={onActiveGameChange}
          />
        </div>
      </div>
    </section>
  );
}