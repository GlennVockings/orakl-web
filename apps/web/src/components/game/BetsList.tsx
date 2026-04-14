"use client"

import { useBets } from "@/hooks"
import { Spinner } from "../ui/spinner";
import { Badge } from "../ui/badge";
import { Info } from "lucide-react";


export const BetsList = ({ gameId } : { gameId: string }) => {
	const { bets, isLoading, error } = useBets(gameId);

	if (isLoading) return <div><Spinner /> Bets are Loading</div>

	if (error) return <div>Something fucked up</div>

	if (bets && bets.length < 1) {
		return (
			<div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
				<div className="flex gap-1">
					<Info className="h-4 w-4 mt-0.5" />
					<p>
						<strong>Important:</strong> No stakes. Get involved in the markets above.
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			{
				bets.map((bet) => {
					return (
						<div key={bet.id} className="p-4 bg-accent rounded-md flex flex-col gap-4">
							<div className="flex justify-between">
								<p className="font-[Space_Grotesk] uppercase">{ bet.market.name }</p>
								<Badge>{ bet.status }</Badge>
							</div>
							<div className="flex justify-between">
								<div>
									<p className="text-xs uppercase font-[Space_Grotesk] tracking-wide">selection</p>
									<p className="font-semibold">{ bet.selection.team !== null ? bet.selection.team?.name : bet.selection.label }</p>
								</div>
								<div>
									<p className="text-xs text-right font-[Space_Grotesk] uppercase tracking-wide">amount</p>
									{
										bet.winningSelection !== null && bet.winningSelection.id === bet.selection.id ? (
											<p className="text-primary tracking-wide font-[Space_Grotesk] text-right">+{ bet.potentialReturn  }</p>
										) : (
											<p className="text-destructive tracking-wide font-[Space_Grotesk] text-right">-{ bet.stake }</p>
										)
									}
								</div>
							</div>
						</div>
					)
				})
			}
		</div>
	)
}