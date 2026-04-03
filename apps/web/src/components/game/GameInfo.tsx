"use client"

import { apiFetch } from "@/lib/api";
import { Game } from "@/lib/types";
import useSWR from "swr";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";

const fetcher = (gameId: string) =>
	apiFetch<Game>(`/games/${gameId}`, {
		method: "GET",
	})

export const GameInfo = ({ gameId } : { gameId: string }) => {
	const { data, error, isLoading } = useSWR(
		["game", gameId],
		([, id]) => fetcher(id),
		{
			revalidateOnFocus: false,
		}
	);

	if (isLoading) {
		return <div className="p-2">Loading leaderboard...</div>;
	}

	if (error) {
		return <div className="p-2">Failed to load leaderboard.</div>;
	}

	return (
		<div className="mb-4 flex justify-between">
			<div>
				<p className="font-[Space_Grotesk] uppercase text-3xl text-white">{data?.name}</p>
				<p>Join Code: { data?.joinCode }</p>
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button variant={"default"} size={"icon-lg"}>
						<Settings />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Settings</DialogTitle>
						<DialogDescription>Controls for admins</DialogDescription>
					</DialogHeader>
					<Button>
						Add Team
					</Button>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default GameInfo;