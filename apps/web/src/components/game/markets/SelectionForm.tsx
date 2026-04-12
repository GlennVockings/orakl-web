"use client"

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Market, Selection } from "@/lib/types";
import { MakeBet } from "./MakeBet";
import { useState } from "react";

export const SelectionForm = ({ selections, market, gameId } : { selections: Selection[], market: Market, gameId: string }) => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<div className="flex flex-col">
			{
				selections.map((selection) => {
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