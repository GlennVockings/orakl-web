"use client"

import { DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import z from "zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { apiFetch } from "@/lib/api"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "../ui/input-group"
import { XIcon } from "lucide-react"
import { Label } from "../ui/label"
import { toast } from "sonner"
import { Game } from "@/lib/types"
import { useGames } from "@/hooks/use-games"
import { useState } from "react"

const formSchema = z.object({
	name: z.string().min(5, {
		message: "Name must be at least 5 characters"
	}),
	startingChips: z.number().int().gte(1000, {
		message: "must be greater than 1000"
	}),
	teams: z.array(
		z.object({
			team: z.string().min(2, {message: "Team name must be at least 2 characters"})
		})
	)
})

export const CreateGameDialog = () => {
	const [open, setOpen] = useState(false);
	const { mutate } = useGames(); 

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			startingChips: 1000,
			teams: [{ team: "" }]
		}
	})

	const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teams",
  })

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload = {
			name: values.name,
			startingChips: values.startingChips,
			teamNames: values.teams
				.map((t) => t.team.trim())
				.filter(Boolean),
		};
		await apiFetch<Game>("/games/create", {
			method: "POST",
			body: JSON.stringify({ ...payload })
		})
		.then((res) => {
			setOpen(false)
		})
		await mutate();
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					Create game
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Create game</DialogTitle>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							control={form.control}
							name="name"
							render={({ field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Name</FieldLabel>
									<Input 
										{...field} 
										placeholder="Sports Day"
										id={field.name}
										aria-invalid={fieldState.invalid} 
										required={true}
										/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="startingChips"
							render={({ field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel htmlFor={field.name}>Starting chips</FieldLabel>
									<Input 
										{...field} 
										id={field.name}
										aria-invalid={fieldState.invalid} 
										type="number"
									/>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Label>Teams</Label>
						{fields.map((field, index) => (
								<Controller
									key={field.id}
									name={`teams.${index}.team`}
									control={form.control}
									render={({ field: controllerField, fieldState }) => (
										<Field
											orientation="horizontal"
											data-invalid={fieldState.invalid}
										>
											<FieldContent>
												<InputGroup>
													<InputGroupInput
														{...controllerField}
														id={`form-rhf-array-email-${index}`}
														aria-invalid={fieldState.invalid}
														placeholder="Team name"
													/>
													{fields.length > 1 && (
														<InputGroupAddon align="inline-end">
															<InputGroupButton
																type="button"
																variant="ghost"
																size="icon-xs"
																onClick={() => remove(index)}
																aria-label={`Remove email ${index + 1}`}
															>
																<XIcon />
															</InputGroupButton>
														</InputGroupAddon>
													)}
												</InputGroup>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</FieldContent>
										</Field>
									)}
								/>
						))}
						<Button
							type="button"
							onClick={() => append({ team: "" })}
						>
							Add Team
						</Button>
					</FieldGroup>
					<DialogFooter className="pt-6 mt-6 border-t-2 border-primary/50">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Create Game</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}