"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { apiFetch } from "@/lib/api"
import { MonitorX } from "lucide-react"
import React, { useState } from "react"


export const CloseMarket = ({ gameId, marketId} : { gameId: string, marketId: string}) => {
	const [open, setOpen] = useState<boolean>(false);

	async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();

		await apiFetch(`/games/${gameId}/markets/${marketId}/close`, {
			method: "POST",
		})

		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"outline"} size={"icon-sm"}>
					<MonitorX />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Close this market?</DialogTitle>
				</DialogHeader>
				<form className="flex justify-center gap-4" onSubmit={onSubmit}>
					<DialogClose asChild>
						<Button variant={"outline"}>
							Cancel
						</Button>
					</DialogClose>
					<Button type="submit">
						Close Market
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}