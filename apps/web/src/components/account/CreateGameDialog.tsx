"use client"

import { DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"
import { apiFetch } from "@/lib/api"

const formSchema = z.object({
	name: z.string().min(5, {
		message: "Name must be at least 5 characters"
	}),
	startingChips: z.number().int().gte(1000, {
		message: "must be greater than 1000"
	})
})

export const CreateGameDialog = () => {

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			startingChips: 1000,
		}
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
		await apiFetch("/games", {
			method: "POST",
			body: JSON.stringify({ ...values })
		})
	}

	return (
		<Dialog>
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
									/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
							)}
						/>
					</FieldGroup>
					<DialogFooter className="pt-6">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}