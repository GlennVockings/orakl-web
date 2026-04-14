"use client"

import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { apiFetch } from "@/lib/api"
import { Team } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Edit, Trash, X } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSWRConfig } from "swr"
import z from "zod"

const formSchema = z.object({
	teamId: z.string(),
	newName: z.string().min(2, "Team name must be at least 2 characters"),
});

export const EditTeam = ({ team, gameId } : { team: Team, gameId: string }) => {
	const [ editText, setEditText ] = useState<boolean>(false);
	const { mutate } = useSWRConfig();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			teamId: team.id,
			newName: team.name,
		}
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (team.name === values.newName) {
			setEditText(false);
			return;
		}
		const payload = {
			...values,
			oldName: team.name,
		}

		await apiFetch(`/games/${gameId}/teams`, {
			method: "PATCH",
			body: JSON.stringify(payload)
		});
		await mutate(["teams", gameId]);
		await mutate(["markets", gameId]);
		await mutate(["bets", gameId]);
		setEditText(false);
	}

	return (
		<div className="bg-muted rounded-md border-accent border p-4 flex justify-between items-center">
			{
				editText ? (
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-4 w-full pr-4">
						<FieldGroup>
							<Controller
								control={form.control}
								name="newName"
								render={({ field, fieldState}) => (
									<Field data-invalid={fieldState.invalid}>
										<Input
											{...field}
											id={field.name}
											aria-invalid={fieldState.invalid}
											required
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>
						<ButtonGroup>
							<Button variant={"default"} size={"icon-sm"} type="submit"><Check /></Button>
							<Button variant={"outline"} size={"icon-sm"} onClick={() => setEditText(false)}><X /></Button>
						</ButtonGroup>
					</form>
				) : (
					<p>{ team.name }</p>
				)
			}
			<div>
				<ButtonGroup>
					<Button variant={"default"} size={"icon-sm"} onClick={() => setEditText(true)}><Edit /></Button>
					<Button variant={"destructive"} size={"icon-sm"}><Trash /></Button>
				</ButtonGroup>
			</div>
		</div>
	)
}