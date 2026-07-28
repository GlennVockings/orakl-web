"use client"

import { Badge } from "@/components/ui/badge";
import { SelectionForm } from "./SelectionForm";
import { AddMarket } from "./AddMarket";
import { useGameMe, useMarkets, useTeams } from "@/hooks";
import { Info, Trash } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { SettleMarket } from "./SettleMarket";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { CloseMarket } from "./CloseMarket";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { MarketStatus } from "@/lib/types";

export const Markets = ({ gameId } : { gameId: string }) => {
	const { markets, error, isLoading } = useMarkets(gameId);
	const { teams, teamsLoading } = useTeams(gameId);
	const { gameMe } = useGameMe(gameId);
	const [hideSettled, setHideSettled] = useState<boolean>(false);	

	const filteredMarkets = hideSettled
  ? markets.filter((market) => market.status !== MarketStatus.SETTLED)
  : markets;

	const settledCount = markets.filter(
		(market) => market.status === MarketStatus.SETTLED
	).length;
	
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
			<div className="flex flex-col gap-2">
				<p className=" uppercase text-2xl">Markets</p>
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
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-2">
			<div className="flex justify-between items-center">
				<p className=" uppercase text-2xl">Markets</p>
				<div className="flex items-center space-x-2">
					<Switch 
						id="hide-completed" 
						checked={hideSettled}
						onCheckedChange={setHideSettled} 
					/>
					<Label htmlFor="hide-completed">
						Hide settled {settledCount > 0 ? `(${settledCount})` : ""}
					</Label>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<AddMarket teams={teams} gameId={gameId} isAdmin={gameMe?.isAdmin || false} />
				{
					filteredMarkets.length === 0 ? (
						<div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
							<div className="flex gap-1">
								<Info className="h-4 w-4 mt-0.5" />
								<p>No open or closed markets to show.</p>
							</div>
						</div>
					) : (
						filteredMarkets?.map((market) => (
							<div key={market.id}>
								<div className="bg-muted border-2 border-accent p-4 flex flex-col gap-4 rounded-md">
									<div className="flex justify-between">
										{ 
											gameMe?.isAdmin ? (
												<ButtonGroup>
													<Button variant={"destructive"} size={"icon-sm"}><Trash /></Button>
													<CloseMarket marketId={market.id} gameId={gameId} />
													<SettleMarket gameId={gameId} market={market} />
												</ButtonGroup>
											) : (
												<div className="flex-grow"></div>
											) 
										}
										{ renderBadge(market.status) }
									</div>
									<div className="flex flex-col gap-4">
										<p className=" uppercase text-2xl">{ market.name }</p>
										<SelectionForm selections={market.selections} market={market} gameId={gameId} />
									</div>
								</div>
							</div>
						))
					)
				}
			</div>
		</div>
	)
}

export default Markets;