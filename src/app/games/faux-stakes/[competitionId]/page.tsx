"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  ListChecks,
  RefreshCw,
  Trophy,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { FauxStakesLeaderboard } from "@/components/faux-stakes/FauxStakesLeaderboard";
import { MarketSetup } from "@/components/faux-stakes/MarketSetup";
import { PlayersPanel } from "@/components/faux-stakes/PlayersPanel";
import { TeamSetup } from "@/components/faux-stakes/TeamSetup";
import { NodeEntrance } from "@/components/nodes/NodeEntrance";
import { NodeShell } from "@/components/nodes/NodeShell";
import { Button } from "@/components/ui/button";
import { apiFetch, isApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type Competition = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  joinCode?: string;
  gameType: "FAUX_STAKES" | "PREDICTOR";
};

type Membership = {
  role: "HOST" | "ADMIN" | "PLAYER";
  isAdmin?: boolean;
};

type CompetitionState =
  | { status: "loading" }
  | {
      status: "ready";
      competition: Competition;
      membership: Membership;
    }
  | { status: "error"; message: string };

type DashboardSection = "markets" | "teams" | "leaderboard" | "players";

type PrimaryTab = "markets" | "teams" | "leaderboard";

type SetupStepProps = {
  number: number;
  title: string;
  description: string;
  action: string;
  onClick: () => void;
};

function competitionErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return "We couldn't load this competition. Please try again.";
  }

  switch (error.kind) {
    case "authentication":
      return "Your session has expired. Please sign in again.";
    case "permission":
      return "Your account does not have access to this competition.";
    case "not_found":
      return "This competition could not be found.";
    case "network":
      return "We couldn't reach Orakl. Check your connection and try again.";
    case "server":
      return "Orakl couldn't load this competition right now. Please try again.";
    default:
      return error.message || "We couldn't load this competition.";
  }
}

function SetupStep({
  number,
  title,
  description,
  action,
  onClick,
}: SetupStepProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.08] py-5 first:border-t-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#F05A28]/35 bg-[#F05A28]/10 text-sm font-semibold text-[#FF9A75]">
        {number}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-medium text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-white/45">{description}</p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onClick}
        className="rounded-full border-white/[0.14] bg-white/[0.04] text-white hover:bg-white/[0.08]"
      >
        {action}
      </Button>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F05A28]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-xl font-medium text-white">{title}</h2>

      <p className="mt-1 max-w-2xl text-sm leading-6 text-white/45">
        {description}
      </p>
    </div>
  );
}

export default function FauxStakesCompetitionPage() {
  const router = useRouter();
  const params = useParams<{ competitionId: string }>();
  const competitionId = params.competitionId;

  const { data: session, isPending } = authClient.useSession();

  const [state, setState] = useState<CompetitionState>({
    status: "loading",
  });

  const [activeTab, setActiveTab] = useState<PrimaryTab>("markets");
  const [setupExpanded, setSetupExpanded] = useState(true);
  const [teamCount, setTeamCount] = useState<number | null>(null);

  const loadCompetition = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const encodedId = encodeURIComponent(competitionId);

      const [competition, membership] = await Promise.all([
        apiFetch<Competition>(`/competitions/${encodedId}`),
        apiFetch<Membership>(`/competitions/${encodedId}/me`),
      ]);

      if (competition.gameType !== "FAUX_STAKES") {
        setState({
          status: "error",
          message: "This competition is not a Faux Stakes competition.",
        });
        return;
      }

      setState({
        status: "ready",
        competition,
        membership,
      });
    } catch (error) {
      setState({
        status: "error",
        message: competitionErrorMessage(error),
      });
    }
  }, [competitionId]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth");
    }
  }, [isPending, router, session]);

  useEffect(() => {
    if (!session?.user.id || !competitionId) {
      return;
    }

    void loadCompetition();
  }, [session?.user.id, competitionId, loadCompetition]);

  function scrollToSection(section: DashboardSection) {
    if (
      section === "markets" ||
      section === "teams" ||
      section === "leaderboard"
    ) {
      setActiveTab(section);
    }

    requestAnimationFrame(() => {
      document.getElementById(`competition-${section}`)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  if (isPending || !session) {
    return <main className="min-h-screen bg-[#09090b]" />;
  }

  const competition = state.status === "ready" ? state.competition : null;
  const membership = state.status === "ready" ? state.membership : null;

  const canManage =
    membership?.role === "HOST" ||
    membership?.role === "ADMIN" ||
    membership?.isAdmin === true;

  const canInvite = canManage && Boolean(competition?.joinCode);

  return (
    <NodeEntrance label="Faux Stakes">
      <NodeShell
        eyebrow="Faux Stakes / Competition"
        title={competition?.name ?? "Your competition"}
        description={
          competition?.description ||
          "Make your calls, manage your Orakls and follow the competition."
        }
        actions={
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/account")}
            className="rounded-full text-white/60 hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Your games
          </Button>
        }
      >
        {state.status === "loading" ? (
          <p role="status" className="py-12 text-sm text-white/50">
            Loading competition…
          </p>
        ) : null}

        {state.status === "error" ? (
          <div role="alert" className="max-w-xl py-12">
            <h2 className="text-xl font-medium text-white">
              Competition unavailable
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/50">
              {state.message}
            </p>

            <Button
              type="button"
              onClick={() => void loadCompetition()}
              className="mt-6 rounded-full bg-[#F05A28] text-white hover:bg-[#D94C20]"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </Button>
          </div>
        ) : null}

        {competition && membership ? (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/[0.12] bg-white/[0.035] px-3 py-1 text-xs text-white/55">
                {membership.role === "HOST"
                  ? "Host"
                  : membership.role === "ADMIN"
                    ? "Admin"
                    : "Player"}
              </span>

              {teamCount !== null ? (
                <span className="rounded-full border border-white/[0.12] bg-white/[0.035] px-3 py-1 text-xs text-white/55">
                  {teamCount} {teamCount === 1 ? "team" : "teams"}
                </span>
              ) : null}

              {canInvite && competition.joinCode ? (
                <span className="rounded-full border border-[#F05A28]/25 bg-[#F05A28]/[0.08] px-3 py-1 text-xs font-medium text-[#FF9A75]">
                  Code {competition.joinCode}
                </span>
              ) : null}
            </div>

            {canManage ? (
              <section
                aria-labelledby="setup-heading"
                className="rounded-2xl border border-[#F05A28]/20 bg-[#F05A28]/[0.035] p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ListChecks
                        className="size-4 text-[#F05A28]"
                        aria-hidden="true"
                      />

                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#FF9A75]">
                        Competition setup
                      </p>
                    </div>

                    <h2
                      id="setup-heading"
                      className="mt-3 text-xl font-medium text-white"
                    >
                      Set up your competition
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                      Add teams, prepare markets and invite players. These are
                      suggestions rather than gates — each market controls its
                      own lifecycle.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSetupExpanded((current) => !current)}
                    aria-expanded={setupExpanded}
                    aria-controls="setup-steps"
                    className="shrink-0 rounded-lg p-2 text-white/55 hover:bg-white/[0.06] hover:text-white"
                  >
                    {setupExpanded ? (
                      <ChevronUp className="size-5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="size-5" aria-hidden="true" />
                    )}

                    <span className="sr-only">
                      {setupExpanded
                        ? "Collapse setup guide"
                        : "Expand setup guide"}
                    </span>
                  </button>
                </div>

                {setupExpanded ? (
                  <div id="setup-steps" className="mt-6">
                    <SetupStep
                      number={1}
                      title="Create teams"
                      description="Add competitors once, then reuse them in team-based markets."
                      action="Teams"
                      onClick={() => scrollToSection("teams")}
                    />

                    <SetupStep
                      number={2}
                      title="Create markets"
                      description="Prepare draft markets, then open each one whenever you're ready for players to stake."
                      action="Markets"
                      onClick={() => scrollToSection("markets")}
                    />

                    <SetupStep
                      number={3}
                      title="Invite players"
                      description={
                        canInvite
                          ? "Share the competition code while you continue preparing markets."
                          : "Open the players panel to manage competition membership."
                      }
                      action="Players"
                      onClick={() => scrollToSection("players")}
                    />
                  </div>
                ) : null}
              </section>
            ) : null}

            <nav
              aria-label="Competition sections"
              className="sticky top-2 z-20 grid grid-cols-3 gap-1 rounded-xl border border-white/[0.12] bg-[#111114]/95 p-1 backdrop-blur lg:hidden"
            >
              {(
                [
                  {
                    id: "markets",
                    label: "Markets",
                    icon: LayoutGrid,
                  },
                  {
                    id: "teams",
                    label: "Teams",
                    icon: Users,
                  },
                  {
                    id: "leaderboard",
                    label: "Leaderboard",
                    icon: Trophy,
                  },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2 py-3 text-xs font-medium transition-colors ${
                      active
                        ? "bg-[#F05A28] text-white"
                        : "text-white/50 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />

                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="grid items-start gap-5 lg:grid-cols-12">
              <main className="min-w-0 space-y-5 lg:col-span-8">
                <section
                  id="competition-markets"
                  className={`scroll-mt-24 ${
                    activeTab === "markets" ? "block" : "hidden lg:block"
                  }`}
                >
                  <SectionHeading
                    eyebrow="Play"
                    title="Markets"
                    description={
                      canManage
                        ? "Create markets and control when each one is open for staking."
                        : "Choose your outcomes and decide how many Orakls you're willing to put behind them."
                    }
                  />

                  <MarketSetup
                    competitionId={competition.id}
                    isHost={canManage}
                  />
                </section>

                <section
                  id="competition-teams"
                  className={`scroll-mt-24 ${
                    activeTab === "teams" ? "block" : "hidden lg:block"
                  }`}
                >
                  <SectionHeading
                    eyebrow="Competition"
                    title="Teams"
                    description={
                      canManage
                        ? "Manage the teams available when creating team markets."
                        : "Teams currently available in this competition."
                    }
                  />

                  <TeamSetup
                    competitionId={competition.id}
                    isHost={canManage}
                    onTeamsChange={(teams) => setTeamCount(teams.length)}
                  />
                </section>
              </main>

              <aside className="min-w-0 space-y-5 lg:col-span-4">
                <section
                  id="competition-leaderboard"
                  className={`scroll-mt-24 ${
                    activeTab === "leaderboard" ? "block" : "hidden lg:block"
                  }`}
                >
                  <FauxStakesLeaderboard competitionId={competition.id} />
                </section>

                <section id="competition-players" className="scroll-mt-24">
                  <PlayersPanel
                    competitionId={competition.id}
                    isHost={canManage}
                  />
                </section>
              </aside>
            </div>
          </div>
        ) : null}
      </NodeShell>
    </NodeEntrance>
  );
}
