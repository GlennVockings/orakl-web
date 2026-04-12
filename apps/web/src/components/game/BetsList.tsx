"use client"

import { useBets } from "@/hooks"
import { Spinner } from "../ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";


export const BetsList = ({ gameId } : { gameId: string }) => {
	const { bets, isLoading, error } = useBets(gameId);

	console.log(error)

	if (isLoading) return <div><Spinner /> Bets are Loading</div>

	if (error) return <div>Something fucked up</div>

	if (bets && bets.length < 1) {
		return (
			<div>
				Nothing here mate
			</div>
		)
	}

	return (
		<div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Market</TableHead>
						<TableHead>Outcome</TableHead>
						<TableHead>Selection</TableHead>
						<TableHead>Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{
						bets.map((bet) => {
							return (
								<TableRow key={bet.id}>
									<TableCell className="whitespace-normal">{ bet.market.name }</TableCell>
									{
										bet.isSettled ? (
											<TableCell>{ bet.winningSelection.team?.name ? bet.winningSelection.team?.name : bet.winningSelection.label }</TableCell>
										) : (
											<TableCell><Badge>{ bet.status}</Badge></TableCell>
										)
									}
									<TableCell className="text-center font-semibold">{ bet.selection.team !== null ? bet.selection.team?.name : bet.selection.label }</TableCell>
									{
										bet.winningSelection !== null && bet.winningSelection.id === bet.selection.id ? (
											<TableCell className="text-primary tracking-wide font-[Space_Grotesk] text-center">+{ bet.potenitalReturn  }</TableCell>
										) : (
											<TableCell className="text-destructive tracking-wide font-[Space_Grotesk] text-center">-{ bet.stake }</TableCell>
										)
									}
								</TableRow>
							)
						})
					}
				</TableBody>
			</Table>
		</div>
	)
}