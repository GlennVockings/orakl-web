import { Activity, MessageCircleMore, Trophy } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Make your call",
    description:
      "Choose a game, enter your predictions and commit to what you think happens next.",
    icon: MessageCircleMore,
  },
  {
    number: "02",
    title: "Follow the action",
    description:
      "Orakl tracks the outcome and keeps the competition moving as events unfold.",
    icon: Activity,
  },
  {
    number: "03",
    title: "Prove your knowledge",
    description:
      "Compare results, climb the table and discover who consistently knows best.",
    icon: Trophy,
  },
];

export function HowItWorks() {
  return (
    <div className="rounded-3xl border border-border/60 bg-background/75 p-8 shadow-sm backdrop-blur-md sm:p-10 lg:p-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          How Orakl works
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Make the call. Follow the moment. Prove you knew.
        </h2>

        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          Orakl turns opinions into shared competition, giving every prediction
          a result and every group something to play for.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;

          return (
            <article
              key={step.number}
              className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-semibold text-primary">
                  {step.number}
                </span>

                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
              </div>

              <h3 className="mt-10 text-xl font-semibold tracking-tight">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-muted-foreground">
                {step.description}
              </p>

              <div
                aria-hidden="true"
                className="absolute inset-x-6 bottom-0 h-px bg-primary/30"
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
