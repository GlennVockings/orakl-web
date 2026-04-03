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

    socket.on("game.member_joined", onMemberJoined);

    return () => {
      socket.off("game.member_joined", onMemberJoined);
    };
  }, [gameId]);

  return null;
}