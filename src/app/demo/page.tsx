import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#050507] px-5 py-12 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            ORAKL
          </Link>

          <Link
            href="/"
            className="text-sm text-white/60 transition-colors hover:text-white"
          >
            Back to Orakl
          </Link>
        </nav>

        <header className="mb-12 max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#F05A28]">
            Interactive experiences
          </p>

          <h1 className="mb-6 text-4xl font-semibold tracking-tight sm:text-6xl">
            Play before you join.
          </h1>

          <p className="max-w-2xl text-lg leading-8 text-white/60">
            Discover how Orakl works through playable demonstrations. No
            account, no setup and no real money required.
          </p>
        </header>

        <section aria-label="Available demonstrations">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article className="flex flex-col rounded-3xl border border-[#F05A28]/30 bg-[#F05A28]/[0.07] p-7">
              <div className="mb-8 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F05A28]">
                  Faux Stakes
                </span>

                <span className="rounded-full bg-[#F05A28]/15 px-3 py-1 text-xs text-[#F05A28]">
                  Playable
                </span>
              </div>

              <h2 className="mb-3 text-3xl font-semibold tracking-tight">
                Make the call.
              </h2>

              <p className="mb-8 flex-1 leading-7 text-white/60">
                Back your prediction, manage your virtual balance and climb the
                leaderboard as markets settle.
              </p>

              <Link
                href="/demo/faux-stakes"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F05A28] px-6 text-sm font-semibold text-[#050507] transition-colors hover:bg-[#ff784e]"
              >
                Play Faux Stakes demo
              </Link>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-7">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Predictor
              </p>
              <h2 className="mb-3 text-3xl font-semibold">
                Predict the outcome.
              </h2>
              <p className="flex-1 leading-7 text-white/50">
                A future Orakl experience built around sporting predictions and
                competitions.
              </p>
              <p className="mt-8 text-sm text-white/35">In development</p>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.035] p-7">
              <p className="mb-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                Arena
              </p>
              <h2 className="mb-3 text-3xl font-semibold">Enter the Arena.</h2>
              <p className="flex-1 leading-7 text-white/50">
                A future home for competitive events, creatures and collectible
                rewards.
              </p>
              <p className="mt-8 text-sm text-white/35">In development</p>
            </article>
          </div>
        </section>

        <footer className="mt-12 border-t border-white/10 pt-6 text-sm text-white/40">
          Demonstrations use simulated events and virtual currency. No
          real-money betting is involved.
        </footer>
      </div>
    </main>
  );
}
