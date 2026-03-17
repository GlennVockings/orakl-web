import { Bet, Leaderboard, MainContent } from "@/components";

export default async function Game({
	params,
} : {
	params: Promise<{id: string}>
}) {
	const { id } = await params;

	return (
		<div className="grid grid-cols-4 py-3 gap-3">
			<div className="flex flex-col gap-3">
				<Bet />
				<Leaderboard gameId={id} />
			</div>
			{/* <div className="col-span-3">
				<MainContent />
			</div> */}
		</div>
	)
}