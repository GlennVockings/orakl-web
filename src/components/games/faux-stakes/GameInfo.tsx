"use client"

import { useGameMe, useInfo } from "@/hooks";
import { Spinner } from "@/components/ui/spinner";

export const GameInfo = ({ gameId } : { gameId: string }) => {
	const { game, error, isLoading } = useInfo(gameId);
	const { gameMe } = useGameMe(gameId);

	if (isLoading) {
		return <div className="p-2"><Spinner /> Loading game info...</div>;
	}

	if (error) {
		return <div className="p-2">Failed to load game info.</div>;
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<p className="font-[Space_Grotesk] uppercase text-4xl text-white">{game?.name}</p>
				<p>Join Code: { game?.joinCode }</p>
			</div>
			<div className="flex gap-4">
				<div className="bg-muted p-4 border-l-2 border-primary rounded-md flex-grow text-lg font-[Space_Grotesk] uppercase tracking-wide max-w-1/2">
					<p className="text-sm">Leaderboard:</p>
					<p className="text-2xl text-primary">#4</p>
				</div>
				<div className="bg-muted p-4 border-l-2 border-primary rounded-md flex-grow text-lg font-[Space_Grotesk] uppercase tracking-wide">
					<p className="text-sm">Budget:</p>
					<p className="text-2xl text-primary">{ gameMe?.currentBalance }</p>
				</div>
			</div>
		</div>
	)
}

export default GameInfo;