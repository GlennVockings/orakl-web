import { CardScene } from "@/components/cards/CardScene";
import { GlassCard } from "@/components/cards/GlassCard";
import { KnowledgeVoid } from "@/components/KnowledgeVoid/KnowledgeVoid";
import Link from "next/link";

export default function FauxStakes() {
  return (
    <KnowledgeVoid
      vanishingPoint={{
        x: 0.6,
        y: 0.75,
      }}
      mobileVanishingX={0.5}
    >
      {/* Hero */}
      <CardScene className="max-w-[860px]">
        <div className="flex flex-col gap-8 sm:gap-10">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
              Faux Stakes
            </p>

            <h1 className="max-w-[720px] text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl sm:leading-[1.05] lg:text-[64px]">
              Make any event more competitive.
            </h1>

            <p className="max-w-[640px] text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Turn sports days, competitions and events into your own
              virtual-stakes game. Add the competitors, create the markets and
              see who makes the best calls.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="inline-flex min-h-11 items-center rounded-full border border-[#F05A28]/40 bg-[#F05A28]/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#F05A28]/25"
            >
              Create a Game
            </Link>

            <Link
              href="/auth"
              className="inline-flex min-h-11 items-center rounded-full border border-white/[0.16] bg-white/[0.08] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.12]"
            >
              Join a Game
            </Link>
          </div>
        </div>
      </CardScene>

      {/* What is Faux Stakes? */}
      <CardScene className="max-w-[1100px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
              What is Faux Stakes?
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Your event. Your stakes. No real money.
            </h2>

            <p className="max-w-[600px] text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Faux Stakes lets you turn almost any event into a competitive
              prediction game using virtual Orakls.
            </p>

            <p className="max-w-[600px] text-base leading-7 text-white/60">
              Players back the outcomes they believe in, decide how many Orakls
              they are willing to risk and try to finish with the strongest
              balance.
            </p>

            <p className="text-sm text-white/35">
              No deposits. No withdrawals. No real-money wagering.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/[0.12] bg-black/20 p-5 backdrop-blur-md sm:p-6">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Summer Sports Day
                </p>

                <p className="mt-2 text-lg font-medium text-white">
                  100m Sprint
                </p>
              </div>

              <div className="h-px bg-white/[0.08]" />

              <div className="flex flex-col gap-3">
                <p className="text-sm font-medium text-white/70">Who wins?</p>

                <MarketOption label="Alex" odds="2.40" />
                <MarketOption label="Jamie" odds="3.10" selected />
                <MarketOption label="Sam" odds="4.20" />
                <MarketOption label="Morgan" odds="5.50" />
              </div>

              <div className="h-px bg-white/[0.08]" />

              <div className="grid grid-cols-2 gap-4">
                <Stat label="Balance" value="10,000 Orakls" />
                <Stat label="Stake" value="500 Orakls" />
              </div>

              <div className="rounded-2xl border border-[#F05A28]/20 bg-[#F05A28]/10 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Potential return
                </p>

                <p className="mt-1 text-2xl font-semibold text-white">
                  1,550 Orakls
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardScene>

      {/* How to play */}
      <CardScene className="max-w-[1100px]">
        <div className="flex flex-col gap-10">
          <div className="flex max-w-[640px] flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
              How to play
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Pick. Stake. Watch it unfold.
            </h2>

            <p className="text-base leading-7 text-white/60 sm:text-lg">
              The prediction matters. How strongly you back it matters too.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Step
              number="01"
              title="Join the game"
              body="Create your own Faux Stakes game or join one created by someone else."
            />

            <Step
              number="02"
              title="Explore the markets"
              body="See the events and outcomes available and decide what you think will happen."
            />

            <Step
              number="03"
              title="Back your choice"
              body="Choose an outcome and decide how many Orakls you want to put behind it."
            />

            <Step
              number="04"
              title="Climb the table"
              body="Correct calls grow your balance. Finish with more Orakls than everyone else."
            />
          </div>
        </div>
      </CardScene>

      {/* Your game, your rules */}
      <CardScene className="max-w-[1100px]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
              Build your game
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Your event. Your rules.
            </h2>

            <p className="text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
              Build Faux Stakes around the event you&apos;re actually running.
              Add the competitors, create the markets and shape the game your
              group wants to play.
            </p>

            <p className="text-base leading-7 text-white/50">
              A sports day, office competition, tournament or something
              completely your own — you decide what everyone can back.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/[0.12] bg-black/20 p-5 sm:p-6">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                  Game
                </p>

                <p className="mt-1 text-xl font-medium text-white">
                  Summer Sports Day
                </p>
              </div>

              <SetupSection
                title="Competitors"
                items={["Alex", "Jamie", "Sam", "Morgan"]}
                addLabel="+ Add competitor"
              />

              <SetupSection
                title="Markets"
                items={[
                  "100m Winner",
                  "Tug of War Winner",
                  "Highest Long Jump",
                  "Overall Champion",
                ]}
                addLabel="+ Add market"
              />

              <div className="grid grid-cols-2 gap-4">
                <Stat label="Starting balance" value="10,000 Orakls" />
                <Stat label="Players" value="18 joined" />
              </div>
            </div>
          </div>
        </div>
      </CardScene>

      {/* Use cases */}
      <CardScene className="max-w-[1100px]">
        <div className="flex flex-col gap-10">
          <div className="flex max-w-[650px] flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
              Built around your event
            </p>

            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              If there&apos;s an outcome, there can be a market.
            </h2>

            <p className="text-base leading-7 text-white/60 sm:text-lg">
              Faux Stakes is designed to work around the competition in front of
              you rather than forcing every game into the same format.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <UseCase
              title="Sports days"
              body="Turn races, jumps and team events into a competition everyone can take part in."
            />

            <UseCase
              title="Office events"
              body="Give colleagues something extra to compete over during company events and challenges."
            />

            <UseCase
              title="Tournaments"
              body="Create markets around matches, rounds, finalists and overall winners."
            />

            <UseCase
              title="Your own ideas"
              body="Define the competitors and markets yourself and build the game around the event."
            />
          </div>
        </div>
      </CardScene>

      {/* Strategy */}
      <CardScene className="max-w-[820px]">
        <div className="mx-auto flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
            The strategy
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[64px]">
            Being right isn&apos;t enough.
          </h2>

          <p className="max-w-[680px] text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            Two players can back the same outcomes and still finish worlds
            apart. How much you stake, where you take a risk and when you hold
            back can matter just as much as the prediction itself.
          </p>

          <p className="max-w-[620px] text-xl font-medium leading-8 text-white/85">
            Faux Stakes rewards judgement, confidence and knowing when not to
            follow the crowd.
          </p>
        </div>
      </CardScene>

      {/* Final CTA */}
      <CardScene className="max-w-[760px]">
        <div className="flex flex-col items-center gap-7 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#F05A28]">
            Faux Stakes
          </p>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Make more of the next event.
          </h2>

          <p className="max-w-[520px] text-lg leading-8 text-white/60">
            Create a game, invite your group and give everyone something to
            back.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/auth"
              className="inline-flex min-h-11 items-center rounded-full border border-[#F05A28]/40 bg-[#F05A28]/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#F05A28]/25"
            >
              Create a Game
            </Link>

            <Link
              href="/auth"
              className="inline-flex min-h-11 items-center rounded-full border border-white/[0.16] bg-white/[0.08] px-5 py-2.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.12]"
            >
              Join a Game
            </Link>
          </div>
        </div>
      </CardScene>
    </KnowledgeVoid>
  );
}

type MarketOptionProps = {
  label: string;
  odds: string;
  selected?: boolean;
};

function MarketOption({ label, odds, selected = false }: MarketOptionProps) {
  return (
    <div
      className={`
        flex items-center justify-between rounded-2xl border px-4 py-3
        ${
          selected
            ? "border-[#F05A28]/40 bg-[#F05A28]/10"
            : "border-white/[0.08] bg-white/[0.03]"
        }
      `}
    >
      <span className="text-sm text-white/75">{label}</span>
      <span className="text-sm font-semibold text-white">{odds}</span>
    </div>
  );
}

type StatProps = {
  label: string;
  value: string;
};

function Stat({ label, value }: StatProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-white/85">{value}</p>
    </div>
  );
}

type StepProps = {
  number: string;
  title: string;
  body: string;
};

function Step({ number, title, body }: StepProps) {
  return (
    <div className="rounded-[24px] border border-white/[0.1] bg-white/[0.025] p-5">
      <p className="text-xs font-medium tracking-[0.18em] text-[#F05A28]">
        {number}
      </p>

      <h3 className="mt-5 text-lg font-medium text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-white/50">{body}</p>
    </div>
  );
}

type SetupSectionProps = {
  title: string;
  items: string[];
  addLabel: string;
};

function SetupSection({ title, items, addLabel }: SetupSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs uppercase tracking-[0.18em] text-white/35">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-sm text-white/70"
          >
            {item}
          </span>
        ))}

        <span className="rounded-full border border-dashed border-[#F05A28]/30 px-3 py-1.5 text-sm text-[#F05A28]/70">
          {addLabel}
        </span>
      </div>
    </div>
  );
}

type UseCaseProps = {
  title: string;
  body: string;
};

function UseCase({ title, body }: UseCaseProps) {
  return (
    <div className="rounded-[24px] border border-white/[0.1] bg-white/[0.025] p-5">
      <div className="mb-5 h-1 w-8 rounded-full bg-[#F05A28]/70" />

      <h3 className="text-lg font-medium text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-white/50">{body}</p>
    </div>
  );
}
