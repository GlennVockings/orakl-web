import { HeroEnergyLine } from "./HeroEnergyLine";

const features = [
  {
    title: "One identity",
    description:
      "Carry your profile, history and achievements across every Orakl game.",
  },
  {
    title: "Shared competitions",
    description:
      "Play with friends, communities and rivals without starting from scratch.",
  },
  {
    title: "Connected leaderboards",
    description:
      "See how your predictions perform within each game and across the platform.",
  },
];

export function PlatformSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-surface">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              The platform
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              More than a collection of games.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              Orakl connects every competition through one shared platform while
              allowing each game to keep its own identity.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border z-50 bg-border lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="bg-background p-8">
                <h3 className="text-xl font-semibold">{feature.title}</h3>

                <p className="mt-4 leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
      
      <HeroEnergyLine />
    </section>
  );
}