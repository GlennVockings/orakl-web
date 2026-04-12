"use client"

import { Badge } from "../../ui/badge";
import { SelectionForm } from "./SelectionForm";
import { AddMarket } from "./AddMarket";
import { useGameMe, useMarkets, useTeams } from "@/hooks";
import { Info } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Drawer } from "@/components/ui/drawer";

export const Markets = ({ gameId } : { gameId: string }) => {
	const { markets, error, isLoading } = useMarkets(gameId);
	const { teams, teamsLoading } = useTeams(gameId);
	const { gameMe } = useGameMe(gameId);

  if (isLoading || teamsLoading) {
    return <div className="p-2"><Spinner /> Loading markets...</div>;
  }

  if (error) {
    return <div className="p-2">Failed to load markets.</div>;
  }

	function renderBadge(status: string) {
		switch (status) {
			case "OPEN":
				return (
					<Badge variant={"open"}>{ status }</Badge>
				)
			case "CLOSED":
				return (
					<Badge variant={"closed"}>{ status }</Badge>
				)
			case "SETTLED":
				return (
					<Badge variant={"closed"}>{ status }</Badge>
				)
			default:
				return (
					<Badge variant={"closed"}>{ status }</Badge>
				)
		}
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
				<AddMarket teams={teams} gameId={gameId} isAdmin={gameMe?.isAdmin || false} />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-4">
			<AddMarket teams={teams} gameId={gameId} isAdmin={gameMe?.isAdmin || false} />
			{
				markets?.map((market) => (
					<div key={market.id}>
						<div className="bg-muted border-2 border-accent p-4 flex flex-col gap-4">
							<div className="flex justify-end">
								{ renderBadge(market.status) }
							</div>
							<div className="flex flex-col gap-4">
								<p className="font-[Space_Grotesk] uppercase text-2xl">{ market.name }</p>
								<SelectionForm selections={market.selections} market={market} gameId={gameId} />
							</div>
						</div>
					</div>
				))
			}
		</div>
	)
}

export default Markets;