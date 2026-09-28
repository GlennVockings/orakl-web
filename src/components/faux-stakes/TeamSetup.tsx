"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus, RefreshCw, Users, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type Team = {
  id: string;
  name: string;
  competitionId: string;
};

type TeamState =
  | { status: "loading" }
  | { status: "ready"; teams: Team[] }
  | { status: "error" };

type TeamSetupProps = {
  competitionId: string;
  isHost: boolean;
  onTeamsChange?: (teams: Team[]) => void;
};

type TeamInput = {
  id: string;
  name: string;
};

function createTeamInput(): TeamInput {
  return {
    id: crypto.randomUUID(),
    name: "",
  };
}

export function TeamSetup({
  competitionId,
  isHost,
  onTeamsChange,
}: TeamSetupProps) {
  const [state, setState] = useState<TeamState>({
    status: "loading",
  });

  const [inputs, setInputs] = useState<TeamInput[]>([createTeamInput()]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const endpoint = `/competitions/${encodeURIComponent(
    competitionId,
  )}/faux-stakes/teams`;

  const loadTeams = useCallback(async () => {
    setState({ status: "loading" });

    try {
      const teams = await apiFetch<Team[]>(endpoint);

      if (!Array.isArray(teams)) {
        setState({ status: "error" });
        return;
      }

      setState({ status: "ready", teams });
      onTeamsChange?.(teams);
    } catch {
      setState({ status: "error" });
    }
  }, [endpoint, onTeamsChange]);

  useEffect(() => {
    void loadTeams();
  }, [loadTeams]);

  const updateInput = (id: string, name: string) => {
    setInputs((current) =>
      current.map((input) => (input.id === id ? { ...input, name } : input)),
    );

    setError(null);
    setSuccess(null);
  };

  const addInput = () => {
    setInputs((current) => [...current, createTeamInput()]);

    setError(null);
    setSuccess(null);
  };

  const removeInput = (id: string) => {
    setInputs((current) =>
      current.length > 1 ? current.filter((input) => input.id !== id) : current,
    );

    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isHost || saving) {
      return;
    }

    const names = inputs.map((input) => input.name.trim()).filter(Boolean);

    if (names.length === 0) {
      setError("Enter at least one team name.");
      return;
    }

    const normalisedNames = names.map((name) => name.toLocaleLowerCase());

    if (new Set(normalisedNames).size !== normalisedNames.length) {
      setError("Each team in this submission needs a different name.");
      return;
    }

    if (state.status === "ready") {
      const existingNames = new Set(
        state.teams.map((team) => team.name.trim().toLocaleLowerCase()),
      );

      if (normalisedNames.some((name) => existingNames.has(name))) {
        setError(
          "One or more of these teams already exists in the competition.",
        );
        return;
      }
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const teams = await apiFetch<Team[]>(endpoint, {
        method: "POST",
        body: JSON.stringify({ names }),
      });

      if (!Array.isArray(teams)) {
        setError("We couldn't save the teams. Please try again.");
        return;
      }

      setState({ status: "ready", teams });
      onTeamsChange?.(teams);

      setInputs([createTeamInput()]);

      setSuccess(
        names.length === 1 ? "Team added." : `${names.length} teams added.`,
      );
    } catch {
      setError("We couldn't reach Orakl. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const teams = state.status === "ready" ? state.teams : [];

  return (
    <section
      id="competition-teams"
      aria-labelledby="competition-teams-heading"
      className="min-w-0 rounded-2xl border border-white/[0.1] bg-white/[0.025] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#F05A28]" aria-hidden="true" />

            <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
              Competition setup
            </p>
          </div>

          <h2
            id="competition-teams-heading"
            className="mt-3 text-xl font-medium text-white"
          >
            Teams
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Add the competitors that markets can use as outcomes.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void loadTeams()}
          disabled={state.status === "loading" || saving}
          aria-label="Refresh teams"
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

      {state.status === "loading" ? (
        <p role="status" className="mt-6 text-sm text-white/45">
          Loading teams…
        </p>
      ) : null}

      {state.status === "error" ? (
        <div className="mt-6" role="alert">
          <p className="text-sm text-red-300">We couldn't load the teams.</p>

          <Button
            type="button"
            variant="outline"
            onClick={() => void loadTeams()}
            className="mt-3 rounded-full border-white/[0.14] bg-white/[0.04] text-white hover:bg-white/[0.08]"
          >
            Try again
          </Button>
        </div>
      ) : null}

      {state.status === "ready" ? (
        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-white/70">
              Competition teams
            </h3>

            <span className="rounded-full border border-white/[0.1] px-3 py-1 text-xs text-white/45">
              {teams.length}
            </span>
          </div>

          {teams.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-white/[0.12] px-4 py-6 text-sm text-white/40">
              {isHost
                ? "No teams yet. Add your first competitors below."
                : "The host hasn't added any teams yet."}
            </p>
          ) : (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {teams.map((team) => (
                <li
                  key={team.id}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.1] bg-[#0e0e11] px-4 py-3"
                >
                  <span
                    className="size-2 shrink-0 rounded-full bg-[#F05A28]"
                    aria-hidden="true"
                  />

                  <span className="min-w-0 truncate text-sm font-medium text-white/80">
                    {team.name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {isHost && state.status === "ready" ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 border-t border-white/[0.08] pt-6"
        >
          <div>
            <h3 className="text-base font-medium text-white">Add teams</h3>

            <p className="mt-2 text-sm leading-6 text-white/45">
              Add one team or several at once. They'll be available when you
              create team-based markets.
            </p>
          </div>

          <div className="space-y-3">
            {inputs.map((input, index) => (
              <div key={input.id} className="flex items-center gap-2">
                <label htmlFor={`team-${input.id}`} className="sr-only">
                  Team {index + 1}
                </label>

                <input
                  id={`team-${input.id}`}
                  type="text"
                  value={input.name}
                  onChange={(event) =>
                    updateInput(input.id, event.target.value)
                  }
                  maxLength={50}
                  required
                  disabled={saving}
                  placeholder={`Team ${index + 1}`}
                  className="min-w-0 flex-1 rounded-xl border border-white/[0.14] bg-[#09090b] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[#F05A28]/70"
                />

                <button
                  type="button"
                  onClick={() => removeInput(input.id)}
                  disabled={saving || inputs.length === 1}
                  aria-label={`Remove team ${index + 1}`}
                  className="rounded-lg p-3 text-white/40 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={addInput}
            disabled={saving || inputs.length >= 100}
            className="rounded-full text-[#FF9A75] hover:bg-[#F05A28]/10 hover:text-[#FF9A75]"
          >
            <Plus className="size-4" aria-hidden="true" />
            Add another team
          </Button>

          {error ? (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          ) : null}

          {success ? (
            <p role="status" className="text-sm text-emerald-300">
              {success}
            </p>
          ) : null}

          <div>
            <Button
              type="submit"
              disabled={saving || inputs.every((input) => !input.name.trim())}
              className="rounded-full bg-[#F05A28] px-6 text-white hover:bg-[#D94C20] disabled:opacity-50"
            >
              <Plus className="size-4" aria-hidden="true" />
              {saving ? "Saving teams…" : "Save teams"}
            </Button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
