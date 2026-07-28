import { BetsList, GameInfo, GameRealtime, Leaderboard, Markets, MarkSeen, Teams } from "@/components";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function Game({
	params,
} : {
	params: Promise<{id: string}>
}) {
	const { id } = await params;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 mb-6 mt-2 gap-4">
			<div className="lg:col-span-3 flex flex-col gap-2">
				<Link href={"/account"} className="text-sm flex gap-1 items-center">
					<ChevronLeft size={18} />
					<p>Back to games</p>
				</Link>
				<GameRealtime gameId={id} />
				<MarkSeen gameId={id} />
				<GameInfo gameId={id} />
			</div>
			<div className="flex justify-between md:flex-col gap-4">
				<Leaderboard gameId={id} />
				<Teams gameId={id} />
			</div>
			<div className="flex flex-col gap-4 lg:col-span-2">
				<Markets gameId={id} />
				<div>
					<p className=" uppercase text-2xl">Stakes</p>
					<BetsList gameId={id} />
				</div>
			</div>
		</div>
	)
}