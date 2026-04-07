"use client"

import { useState } from "react";
import { Selection, SelectionStatus, Team } from "@/lib/types";
import { Badge } from "../../ui/badge";
import { SelectionForm } from "./SelectionForm";
import { AddMarket } from "./AddMarket";
import { useMarkets } from "@/hooks";
import { Info } from "lucide-react";

const selections: Selection[] = [
	{
		id: "1",
		label: "yes",
		decimalOdds: 1.25,
		status: SelectionStatus.ACTIVE,
	},
	{
		id: "2",
		label: "no",
		decimalOdds: 1.25,
		status: SelectionStatus.ACTIVE,
	}
]

const demoTeams: Team[] = [
	{ id: "t1", name: "Red" },
	{ id: "t2", name: "Blue" },
	{ id: "t3", name: "Green" },
	{ id: "t4", name: "Yellow" },
];

export const Markets = ({ gameId } : { gameId: string }) => {
	const { markets, error, isLoading } = useMarkets(gameId);

  if (isLoading) {
    return <div className="p-2">Loading markets...</div>;
  }

  if (error) {
    return <div className="p-2">Failed to load markets.</div>;
  }

	if (markets && markets?.length < 1) {
		return (
			<div className="flex flex-col gap-4">
				<div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
					<div className="flex gap-1">
						<Info className="h-4 w-4 mt-0.5" />
						<p>
							No markets. You can add some below.
						</p>
					</div>
				</div>
				<AddMarket teams={demoTeams} gameId={gameId} />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<AddMarket teams={demoTeams} gameId={gameId} />
			{
				markets?.map((market) => (
					<div key={market.id}>
						<div className="bg-muted border-2 border-accent p-4">
							<div className="flex justify-end">
								{/* <Badge variant={"open"}>open</Badge> */}
								{/* <Badge variant={"closed"}>closed</Badge> */}
								<Badge variant={"settled"}>settled</Badge>
							</div>
							<div className="flex flex-col gap-4">
								<p className="font-[Space_Grotesk] uppercase text-2xl">{ market.name }</p>
								<SelectionForm selections={selections} />
							</div>
						</div>
					</div>
				))
			}
		</div>
	)
}

export default Markets;