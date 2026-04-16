"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { apiFetch } from "@/lib/api"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import { useSWRConfig } from "swr"

export const UndoBet = ({ gameId, betId } : { gameId: string, betId: string }) => {
	const [open, setOpen] = useState<boolean>(false);
	const { mutate } = useSWRConfig();

	async function onUndo() {
		await apiFetch(`/games/${gameId}/bets/${betId}/undo`, {
			method: "POST"
		});

		await mutate(["bets", gameId]);
		await mutate(["game-me", gameId]);

		setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant={"outline"} size={"icon-sm"}>
					<RotateCcw />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Undo Bet</DialogTitle>
					<DialogDescription>Are you sure?</DialogDescription>
				</DialogHeader>
				<div className="flex gap-4 justify-center">
					<DialogClose asChild>
						<Button variant={"outline"}>
							Close
						</Button>
					</DialogClose>
					<Button onClick={onUndo}>
						Sure
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}