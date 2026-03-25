"use client"

import { Button } from "../ui/button";
import { BadgeAlert, Info, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import useSWR from 'swr'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

interface Game {
	id: string;
	name: string;
	status: string;
	joinCode: string;
	startingChips: number;
	lastActivityAt: Date;
	leaderboard: [{
		balance: number;
		displayName: string;
	}];
	myMembership: {
		balance: number;
		hasUpdates: boolean;
	}
}

const fetcher = () => apiFetch<Game[]>("/games", { method: "GET" });

export const GamesList = () => {
	const { data: games, error, isLoading } = useSWR("games", fetcher, {
    revalidateOnFocus: false,
  });

  if (isLoading) return <div>Loading games…</div>;
  if (error) return <div className="text-sm text-destructive">Failed to load games: {String(error)}</div>;

	return (
		<div className="grid grid-cols-1 md:grid-cols-2">
			{
				games && games.length > 0 ? (
					games.map((game: Game) => (
						<Card key={game.id} className="relative">
							<CardHeader>
								<CardTitle>{ game.name }</CardTitle>
								<CardDescription>Join code: { game.joinCode }</CardDescription>
								{ game.myMembership.hasUpdates ? (
									<BadgeAlert color="#db2114" className="absolute right-4 top-4" />
								) : (
									<></>
								)}
							</CardHeader>
							<CardContent>
								<div>
									<div>
										<p>{ game.myMembership.balance }</p>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex gap-2 justify-end">
								<Button asChild>
									<Link href={`/game/${game.id}`}>Open</Link>
								</Button>
								<Button variant={"destructive"} size={"icon"}><Trash2 /></Button>
							</CardFooter>
						</Card>
					))
				) : (
					<div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
						<div className="flex gap-1">
							<Info className="h-4 w-4 mt-0.5" />
							<p>
								No games found
							</p>
						</div>
						<p className="mt-2">
							Use the create game button to start the competition.
						</p>
					</div>
				)
			}
		</div>
	)
}
