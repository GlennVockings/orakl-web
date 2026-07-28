import { CircleCheck, Network, Sparkles, Trophy } from "lucide-react";
import { PageContainer } from "../layout";

const principles = [
  { icon: CircleCheck, title: "Clear", description: "Easy to scan, understand and act on." },
  { icon: Sparkles, title: "Simple", description: "Focused experiences without unnecessary noise." },
  { icon: Network, title: "Connected", description: "People, predictions and competitions feel linked." },
  { icon: Trophy, title: "Punchy", description: "Competitive moments bring colour, motion and energy." },
];

export const PlatformSection = () => {
  return (
    <section className="relative overflow-hidden border-b bg-surface py-20 sm:py-28">
      <PageContainer>
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">The Orakl system</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Professional product design with social energy.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ icon: Icon, title, description }) => (
            <article className="surface-panel p-5" key={title}>
              <div className="mb-8 inline-flex size-10 items-center justify-center rounded-md bg-product-subtle text-product">
                <Icon className="size-5" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}