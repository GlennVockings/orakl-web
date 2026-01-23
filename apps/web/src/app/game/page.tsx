import { Leaderboard, MainContent, Bet } from "@/components";

export default function Game() {
	return (
		<div className="grid grid-cols-4 py-3 gap-3">
			<div className="flex flex-col gap-3">
				<Bet />
				<Leaderboard />
			</div>
			<div className="col-span-3">
				<MainContent />
			</div>
		</div>
	)
}