"use client"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { apiFetch } from "@/lib/api"
import { Market } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Award } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const formSchema = z.object({
	id: z.string(),
	winningSelectionId: z.string()
})


export const SettleMarket = ({ gameId, market } : { gameId: string, market: Market }) => {
	const [open, setOpen] = useState<boolean>(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: market.id,
			winningSelectionId: market.selections[0].id
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await apiFetch(`/games/${gameId}/markets/${market.id}/settle`, {
			method: "POST",
			body: JSON.stringify(values)
		})

		setOpen(false);
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant={"outline"} size={"icon-sm"}>
					<Award />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Settle</SheetTitle>
					<SheetDescription>Choose your winner</SheetDescription>
				</SheetHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="px-4">
					<div className="pb-2">
						<p className="font-[Space_Grotesk] uppercase">{ market.name }</p>
					</div>
					<Controller 
						control={form.control}
						name="winningSelectionId"
						render={({ field, fieldState}) => (
							<Field>
								<RadioGroup
									name={field.name}
                  onValueChange={field.onChange} 
									defaultValue={market.selections[0].id}
								>
									{
										market.selections.map((selection, index) => {
											return (
												<div key={selection.id} className="flex gap-2 items-center">
													<RadioGroupItem value={selection.id} id={`option-${index}`} />
													<Label htmlFor={`option-${index}`}>
														{
															selection.label !== null ? selection.label : selection.team?.name
														}
													</Label>
												</div>
											)
										})
									}
								</RadioGroup>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
					<div className="flex gap-4 pt-4">
						<Button variant={"outline"} size={"sm"} onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button variant={"default"} size={"sm"} type="submit">
							Submit
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	)
}