"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { ArrowRight, LogOut, Plus, RefreshCw, Users } from "lucide-react";
import { useRouter } from "next/navigation";

import { NodeEntrance } from "@/components/nodes/NodeEntrance";
import { NodeShell } from "@/components/nodes/NodeShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

type GameType = "FAUX_STAKES" | "PREDICTOR";

type CompetitionSummary = {
  id: string;
  name: string;
  status: string;
  joinCode: string;
  gameType?: GameType;
  lastActivityAt?: string;
  myMembership?: {
    role: string;
  };
};

type CreatedCompetition = {
  id: string;
  name: string;
  gameType: GameType;
};

type JoinedCompetition = {
  competition: CreatedCompetition;
};

type CompetitionState =
  | { status: "loading" }
  | { status: "ready"; competitions: CompetitionSummary[] }
  | { status: "error" };

function competitionPath(
  competitionId: string,
  gameType: GameType = "FAUX_STAKES",
) {
  const encodedId = encodeURIComponent(competitionId);

  return gameType === "PREDICTOR"
    ? `/games/predictor/${encodedId}`
    : `/games/faux-stakes/${encodedId}`;
}

export function AccountNode() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [state, setState] = useState<CompetitionState>({
    status: "loading",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const [competitionName, setCompetitionName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [joinCode, setJoinCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const loadCompetitions = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const competitions =
        await apiFetch<CompetitionSummary[]>("/competitions");

      if (!Array.isArray(competitions)) {
        setState({ status: "error" });
        return;
      }

      setState({ status: "ready", competitions });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth");
    }
  }, [isPending, router, session]);

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }

    void loadCompetitions();
  }, [session?.user.id, loadCompetitions]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/auth");
    router.refresh();
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = competitionName.trim();

    if (!name || creating) {
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      const competition = await apiFetch<CreatedCompetition>("/competitions", {
        method: "POST",
        body: JSON.stringify({
          name,
          gameType: "FAUX_STAKES",
        }),
      });

      if (!competition?.id) {
        setCreateError(
          "We couldn't create your competition. Please try again.",
        );
        return;
      }

      setCreateOpen(false);
      setCompetitionName("");

      router.push(competitionPath(competition.id, competition.gameType));
    } catch {
      setCreateError("We couldn't reach Orakl. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const code = joinCode.trim().toUpperCase();

    if (code.length !== 6 || joining) {
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      const result = await apiFetch<JoinedCompetition>("/competitions/join", {
        method: "POST",
        body: JSON.stringify({ joinCode: code }),
      });

      if (!result?.competition?.id) {
        setJoinError(
          "We couldn't join that competition. Check the code and try again.",
        );
        return;
      }

      setJoinOpen(false);
      setJoinCode("");

      router.push(
        competitionPath(result.competition.id, result.competition.gameType),
      );
    } catch {
      setJoinError("We couldn't reach Orakl. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050507] text-white">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/40">
          Entering Orakl
        </p>
      </main>
    );
  }

  if (!session) {
    return <main className="min-h-screen bg-[#050507]" />;
  }

  return (
    <NodeEntrance label="Account">
      <NodeShell
        eyebrow="Orakl / Account"
        title={`Welcome back, ${session.user.name}.`}
        description="Your competitions and Orakl activity live here."
        actions={
          <Button
            type="button"
            variant="ghost"
            onClick={() => void handleSignOut()}
            className="rounded-full border border-white/[0.12] bg-white/[0.04] px-4 text-white/60 hover:bg-white/[0.08] hover:text-white"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="min-w-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
                  Your Orakl
                </p>

                <h2 className="mt-2 text-xl font-medium tracking-[-0.02em] text-white">
                  Your games
                </h2>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void loadCompetitions()}
                disabled={state.status === "loading"}
                className="rounded-full text-white/50 hover:bg-white/[0.06] hover:text-white"
              >
                <RefreshCw
                  className={`size-4 ${
                    state.status === "loading" ? "animate-spin" : ""
                  }`}
                  aria-hidden="true"
                />
                Refresh
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={() => {
                  setCreateError(null);
                  setCreateOpen(true);
                }}
                className="rounded-full bg-[#F05A28] px-5 text-white hover:bg-[#D94C20]"
              >
                <Plus className="size-4" aria-hidden="true" />
                Create competition
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setJoinError(null);
                  setJoinOpen(true);
                }}
                className="rounded-full border-white/[0.14] bg-white/[0.04] px-5 text-white hover:bg-white/[0.08]"
              >
                <Users className="size-4" aria-hidden="true" />
                Join competition
              </Button>
            </div>

            {state.status === "loading" ? (
              <p
                role="status"
                className="mt-6 border-y border-white/[0.08] py-10 text-sm text-white/45"
              >
                Loading your games…
              </p>
            ) : null}

            {state.status === "error" ? (
              <div
                role="alert"
                className="mt-6 border-y border-white/[0.08] py-10"
              >
                <p className="text-sm text-white/65">
                  We couldn't load your competitions.
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void loadCompetitions()}
                  className="mt-4 rounded-full border-white/[0.14] bg-white/[0.04] text-white hover:bg-white/[0.08]"
                >
                  Try again
                </Button>
              </div>
            ) : null}

            {state.status === "ready" && state.competitions.length === 0 ? (
              <div className="mt-6 border-y border-white/[0.08] py-10">
                <p className="text-sm font-medium text-white/70">
                  No games yet.
                </p>

                <p className="mt-2 max-w-lg text-sm leading-6 text-white/40">
                  Create a Faux Stakes competition or join one using a
                  six-character invitation code.
                </p>
              </div>
            ) : null}

            {state.status === "ready" && state.competitions.length > 0 ? (
              <div className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                {state.competitions.map((competition) => (
                  <button
                    key={competition.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        competitionPath(competition.id, competition.gameType),
                      )
                    }
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:bg-white/[0.025]"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-white">
                        {competition.name}
                      </span>

                      <span className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/40">
                        <span>{competition.status}</span>

                        {competition.myMembership?.role ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{competition.myMembership.role}</span>
                          </>
                        ) : null}
                      </span>
                    </span>

                    <ArrowRight
                      className="size-4 shrink-0 text-white/40"
                      aria-hidden="true"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </section>

          <aside className="border-t border-white/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
              Account
            </p>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs text-white/30">Name</dt>
                <dd className="mt-1 text-sm text-white/75">
                  {session.user.name}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-white/30">Email</dt>
                <dd className="mt-1 break-all text-sm text-white/75">
                  {session.user.email}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <Dialog
          open={createOpen}
          onOpenChange={(open) => {
            if (!creating) {
              setCreateOpen(open);
              setCreateError(null);
            }
          }}
        >
          <DialogContent className="border-white/[0.12] bg-[#111114] text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                Create Faux Stakes competition
              </DialogTitle>

              <DialogDescription className="text-sm leading-6 text-white/50">
                Give your competition a name. You&apos;ll add teams, markets and
                invite players from its dashboard.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="mt-4 space-y-5">
              <div>
                <label
                  htmlFor="competition-name"
                  className="block text-sm font-medium text-white/75"
                >
                  Competition name
                </label>

                <input
                  id="competition-name"
                  type="text"
                  value={competitionName}
                  onChange={(event) => {
                    setCompetitionName(event.target.value);
                    setCreateError(null);
                  }}
                  required
                  maxLength={100}
                  disabled={creating}
                  autoFocus
                  placeholder="Friday Night Faux Stakes"
                  className="mt-3 w-full rounded-xl border border-white/[0.14] bg-[#09090b] px-4 py-3 text-white outline-none placeholder:text-white/25 focus:border-[#F05A28]/70"
                />
              </div>

              {createError ? (
                <p role="alert" className="text-sm text-red-300">
                  {createError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={!competitionName.trim() || creating}
                className="w-full rounded-full bg-[#F05A28] text-white hover:bg-[#D94C20]"
              >
                {creating ? "Creating competition…" : "Create competition"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={joinOpen}
          onOpenChange={(open) => {
            if (!joining) {
              setJoinOpen(open);
              setJoinError(null);
            }
          }}
        >
          <DialogContent className="border-white/[0.12] bg-[#111114] text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">
                Join a competition
              </DialogTitle>

              <DialogDescription className="text-sm leading-6 text-white/50">
                Enter the six-character invitation code from your host. This
                works across Orakl game types.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleJoin} className="mt-4 space-y-5">
              <div>
                <label
                  htmlFor="join-code"
                  className="block text-sm font-medium text-white/75"
                >
                  Invitation code
                </label>

                <input
                  id="join-code"
                  type="text"
                  value={joinCode}
                  onChange={(event) => {
                    setJoinCode(
                      event.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "")
                        .slice(0, 6),
                    );
                    setJoinError(null);
                  }}
                  required
                  minLength={6}
                  maxLength={6}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={joining}
                  placeholder="ABC123"
                  className="mt-3 w-full rounded-xl border border-white/[0.14] bg-[#09090b] px-4 py-3 text-center font-mono text-xl font-semibold tracking-[0.2em] text-white uppercase outline-none placeholder:text-white/25 focus:border-[#F05A28]/70"
                />
              </div>

              {joinError ? (
                <p role="alert" className="text-sm text-red-300">
                  {joinError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={joinCode.length !== 6 || joining}
                className="w-full rounded-full bg-[#F05A28] text-white hover:bg-[#D94C20]"
              >
                {joining ? "Joining competition…" : "Join competition"}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </NodeShell>
    </NodeEntrance>
  );
}
