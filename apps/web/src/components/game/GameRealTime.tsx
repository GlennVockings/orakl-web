"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { mutate } from "swr";

export function GameRealtime({ gameId }: { gameId: string }) {
  useEffect(() => {
    const socket = getSocket();

    socket.emit("join_game_room", { gameId });

    const onMemberJoined = (payload: {
      gameId: string;
      userId: string;
      displayName: string;
    }) => {
      toast.success(`${payload.displayName} joined the game`);
      mutate(["leaderboard", gameId]);
      mutate(["teams", gameId]);
      mutate(["markets", gameId]);
      mutate("games");
    };

    const onTeamCreated = (payload: {
      gameId: string;
      createdCount: number;
      names: string[];
    }) => {
      const message =
        payload.createdCount === 1
          ? `Team created: ${payload.names[0]}`
          : `${payload.createdCount} teams created`;

      toast.success(message);
      mutate(["teams", gameId]);
      mutate("games");
    };

    const onMarketCreated = (payload: {
      gameId: string;
      marketId: string;
      marketName: string;
    }) => {
      toast.success(`Market created: ${payload.marketName}`);
      mutate(["markets", gameId]);
      mutate("games");
    };

    socket.on("game.member_joined", onMemberJoined);
    socket.on("game.team_created", onTeamCreated);
    socket.on("game.market_created", onMarketCreated);

    return () => {
      socket.off("game.member_joined", onMemberJoined);
      socket.off("game.team_created", onTeamCreated);
      socket.off("game.market_created", onMarketCreated);
    };
  }, [gameId]);

  return null;
}