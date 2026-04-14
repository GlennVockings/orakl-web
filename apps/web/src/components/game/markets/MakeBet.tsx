"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Market, Selection } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { apiFetch } from "@/lib/api"
import { useEffect, useState } from "react"
import { useSWRConfig } from "swr"

const formSchema = z.object({
	stake: z.coerce.number().min(1, "Need to stake something"),
	marketId: z.string(),
	selectionId: z.string()
})

export const MakeBet = ({ market, selection, gameId } : { market: Market, selection: Selection, gameId: string }) => {
	const [potentialReturn, setPotentialReturn ] = useState<number>(100 * selection.decimalOdds);
	const [open, setOpen] = useState<boolean>(false);

	const { mutate } = useSWRConfig();

	const { handleSubmit, control, watch } = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			stake: 100,
			marketId: market.id,
			selectionId: selection.id
		}
	})

	const betAmount = watch("stake")

	useEffect(() => {
		const potReturn = Math.floor((betAmount || 0) * selection.decimalOdds);
		setPotentialReturn(potReturn);
	}, [betAmount, selection.decimalOdds])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await apiFetch(`/games/${gameId}/bets`, {
			method: "POST",
			body: JSON.stringify(values),
		});
		await mutate(["game-me", gameId]);
		await mutate(["leaderboard", gameId]);
		await mutate(["bets", gameId]);

		setOpen(false);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button size={"lg"} className="flex justify-between" variant={"outline"}>
					<p>{ selection.label ? selection.label : selection.team?.name }</p>
					<p>{ selection.decimalOdds }</p>
				</Button>
			</DrawerTrigger>
			<DrawerContent className="pb-10">
				<DrawerHeader>
					<DrawerTitle>Stake amount</DrawerTitle>
					<DrawerDescription>Choose how much to stake?</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col items-center gap-4">
					<p className="font-[Space_Grotesk] uppercase text-lg">{ market.name }</p>
					<p>{ selection.label !== null ? selection.label : selection.team?.name }</p>
					<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
						<FieldGroup>
							<Controller 
								control={control}
								name="stake"
								render={({ field, fieldState}) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor={field.name}>Amount</FieldLabel>
										<Input
											{...field}
											id={field.name}
											type="number"
											aria-invalid={fieldState.invalid}
											required
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>
						<div className="text-center font-[Space_Grotesk] uppercase">
							<p className="text-sm">Potential Return:</p>
							<p className="text-lg tracking-wide text-primary">{ potentialReturn }</p>
						</div>
						<div className="flex gap-2">
							<Button variant={"default"} type="submit" className="flex-grow">Stake</Button>
							<DrawerClose asChild>
								<Button variant={"destructive"} className="flex-grow">Cancel</Button>
							</DrawerClose>
						</div>
					</form>
				</div>
			</DrawerContent>
		</Drawer>
	)
}