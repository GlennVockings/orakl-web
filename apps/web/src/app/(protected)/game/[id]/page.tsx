import { GameInfo, GameRealtime, Leaderboard, MainContent, Markets } from "@/components";

export default async function Game({
	params,
} : {
	params: Promise<{id: string}>
}) {
	const { id } = await params;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 my-6 gap-3">
			<GameRealtime gameId={id} />
			<GameInfo gameId={id} />
			<div className="flex flex-col gap-3">
				<Leaderboard gameId={id} />
			</div>
			<div className="">
				<Markets gameId={id} />
			</div>
		</div>
	)
}