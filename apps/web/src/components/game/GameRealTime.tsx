"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { mutate } from "swr";
import { Market } from "@/lib/types";

export function GameRealtime({ gameId }: { gameId: string }) {
  useEffect(() => {
    const socket = getSocket();

    const joinRoom = () => {
      socket.emit("join_game_room", { gameId });
      console.log("joined room", gameId, socket.id);
    };

    const onConnect = () => {
      console.log("socket connected", socket.id);
      joinRoom();
    };

    const onDisconnect = (reason: string) => {
      console.log("socket disconnected", reason);
    };

    const onReconnectAttempt = () => {
      console.log("socket reconnect attempt");
    };

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

    const onMarketSettled = (payload: Market) => {
      toast.success(`Market settled: ${payload.name}`);
      mutate(["markets", gameId]);
      mutate(["bets", gameId]);
      mutate(["leaderboard", gameId]);
      mutate(["game-me", gameId]);
    }

    const onMarketClosed = (payload: {
      id: string,
      name: string
    }) => {
      toast.success(`Market closed: ${payload.name}`);
      mutate(["markets", gameId]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.io.on("reconnect_attempt", onReconnectAttempt);
    socket.on("game.member_joined", onMemberJoined);
    socket.on("game.team_created", onTeamCreated);
    socket.on("game.market_created", onMarketCreated);
    socket.on("game.market_settled", onMarketSettled);
    socket.on("game.market_closed", onMarketClosed);



    if (socket.connected) {
      joinRoom();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.io.off("reconnect_attempt", onReconnectAttempt);
      socket.off("game.member_joined", onMemberJoined);
      socket.off("game.team_created", onTeamCreated);
      socket.off("game.market_created", onMarketCreated);
      socket.off("game.market_settled", onMarketSettled);
      socket.off("game.market_closed", onMarketClosed);
    };
  }, [gameId]);

  return null;
}