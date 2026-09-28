"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  Crown,
  Loader2,
  RefreshCw,
  Share2,
  UserRound,
  UsersRound,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";

type MemberRole = "HOST" | "ADMIN" | "PLAYER";

type Competition = {
  id: string;
  name: string;
  joinCode: string;
};

type CompetitionMember = {
  id: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user: {
    displayName: string;
  };
};

type PlayersPanelProps = {
  competitionId: string;
  isHost: boolean;
};

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function getRoleLabel(role: MemberRole) {
  if (role === "HOST") {
    return "Host";
  }

  if (role === "ADMIN") {
    return "Admin";
  }

  return "Player";
}

export function PlayersPanel({ competitionId, isHost }: PlayersPanelProps) {
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [members, setMembers] = useState<CompetitionMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (background = false) => {
      if (background) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const [competitionData, memberData] = await Promise.all([
        apiFetch<Competition>(`/competitions/${competitionId}`),
        apiFetch<CompetitionMember[]>(`/competitions/${competitionId}/members`),
      ]);

      if (!competitionData || !memberData) {
        setError("Unable to load players.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setCompetition(competitionData);
      setMembers(memberData);
      setLoading(false);
      setRefreshing(false);
    },
    [competitionId],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function copyJoinCode() {
    if (!competition?.joinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(competition.joinCode);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to copy the join code.");
    }
  }

  async function shareCompetition() {
    if (!competition) {
      return;
    }

    const shareText = `Join "${competition.name}" on Orakl with code ${competition.joinCode}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: competition.name,
          text: shareText,
        });

        return;
      } catch (shareError) {
        if (
          shareError instanceof DOMException &&
          shareError.name === "AbortError"
        ) {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Unable to share the competition.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/40" />
      </div>
    );
  }

  if (error && !competition) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
        <p className="text-sm text-red-300">{error}</p>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => void loadData()}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isHost && competition && (
        <div className="rounded-2xl border border-[#F05A28]/20 bg-[#F05A28]/[0.07] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#F05A28]/20 bg-[#F05A28]/10">
              <Share2 className="h-4 w-4 text-[#F05A28]" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F05A28]">
                Invite players
              </p>

              <h3 className="mt-1 font-semibold text-white">
                Share your join code
              </h3>

              <p className="mt-1 text-sm leading-6 text-white/45">
                Players enter this code from their Orakl account to join the
                competition.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void copyJoinCode()}
              className="group flex min-h-14 flex-1 items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 transition hover:border-[#F05A28]/30"
            >
              <div className="text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                  Join code
                </p>

                <p className="mt-0.5 font-mono text-xl font-semibold tracking-[0.2em] text-white">
                  {competition.joinCode}
                </p>
              </div>

              {copied ? (
                <Check className="h-4 w-4 text-emerald-300" />
              ) : (
                <Copy className="h-4 w-4 text-white/35 transition group-hover:text-white" />
              )}
            </button>

            <Button
              type="button"
              variant="outline"
              className="min-h-14 sm:px-5"
              onClick={() => void shareCompetition()}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          {copied && (
            <p className="mt-2 text-xs text-emerald-300">
              Copied to clipboard.
            </p>
          )}
        </div>
      )}

      {error && competition && (
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <UsersRound className="h-4 w-4 text-[#F05A28]" />

              <h3 className="font-semibold text-white">Players</h3>

              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/40">
                {members.length}
              </span>
            </div>

            <p className="mt-1 text-xs text-white/40">
              Everyone currently in this competition.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={refreshing}
            onClick={() => void loadData(true)}
            aria-label="Refresh players"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {members.length === 0 ? (
          <div className="p-8 text-center">
            <UserRound className="mx-auto h-6 w-6 text-white/15" />

            <p className="mt-3 text-sm text-white/40">
              No players have joined yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {members.map((member) => {
              const displayName = member.user.displayName.trim() || "Player";

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-5 py-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs font-semibold text-white/65">
                    {getInitials(displayName) || "?"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-white/80">
                        {displayName}
                      </p>

                      {member.role === "HOST" && (
                        <Crown className="h-3.5 w-3.5 shrink-0 text-[#F05A28]" />
                      )}
                    </div>

                    <p className="mt-0.5 text-xs text-white/30">
                      {getRoleLabel(member.role)}
                    </p>
                  </div>

                  <p className="hidden text-xs text-white/25 sm:block">
                    Joined{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "numeric",
                      month: "short",
                    }).format(new Date(member.joinedAt))}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isHost && (
        <p className="px-1 text-xs leading-relaxed text-white/30">
          Only the host needs the join code. Your membership is already active.
        </p>
      )}
    </div>
  );
}
