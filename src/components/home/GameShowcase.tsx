import { PageContainer, EnergyLine } from "@/components";

const games = [
  { id: "faux-stakes", title: "Faux Stakes", description: "Friendly markets. Fake stakes. Real bragging rights.", caption: "The existing game remains available while Orakl grows into a multi-game platform." },
  { id: "predictor", title: "Predictor", description: "Predict the outcome of events and earn bragging rights.", caption: "Join the community of predictors and test your knowledge." },
];

export const GameShowcase = () => {
  return (
    <PageContainer className="py-16 sm:py-20">
      <div className="flex gap-4">
        {games.map(({ id, title, description, caption }) => (
          <div className="relative overflow-hidden rounded-xl bg-card px-6 py-10 text-brand transition-all cursor-pointer sm:px-10 hover:-translate-y-2 hover:shadow" data-product={id} key={id}>
            <EnergyLine className="text-brand" />
            <div className="relative max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">{title}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">{description}</h2>
              <p className="mt-4 text-brand/70">{caption}</p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  )
}