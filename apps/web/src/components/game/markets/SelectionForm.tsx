"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Market, MarketStatus, Selection, SelectionStatus } from "@/lib/types";
import { MakeBet } from "./MakeBet";
import { useState } from "react";
import { Crown } from "lucide-react";

export const SelectionForm = ({ selections, market, gameId } : { selections: Selection[], market: Market, gameId: string }) => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col gap-1">
			{
				selections.map((selection) => {
					if (market.status !== MarketStatus.OPEN) {
						return (
							<div key={selection.id} className="flex items-center justify-between h-10 rounded-sm px-4 shadow-xs border-2 border-accent">
								<div className="flex gap-3">
									{ selection.status === SelectionStatus.WINNER ? (<Crown color="#FFBF00" />) : (<div className="w-6"></div>)}
									<p>{ selection.label ? selection.label : selection.team?.name }</p>
								</div>
								<p>{ selection.decimalOdds }</p>
							</div>
						)
					}

					return (
						<Drawer key={selection.id} open={open} onOpenChange={setOpen}>
							<DrawerTrigger asChild>
								<Button size={"lg"} className="flex justify-between" variant={"outline"}>
									<p>{ selection.label ? selection.label : selection.team?.name }</p>
									<p>{ selection.decimalOdds }</p>
								</Button>
							</DrawerTrigger>
							<DrawerContent className="pb-10">
								<DrawerHeader>
									<DrawerTitle>Stake amount</DrawerTitle>
								</DrawerHeader>
								<MakeBet market={market} selection={selection} gameId={gameId} setOpen={setOpen} />
							</DrawerContent>
						</Drawer>
					)
				})
			}
		</div>
	)
}

export default SelectionForm;