"use client"

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { apiFetch } from "@/lib/api";

const formSchema = z.object({
	name: z.string().min(2, "Team name must be at least 2 characters"),
	color: z.string(),
});

export const AddTeam = ({ className, gameId } : { className: string, gameId: string }) => {
		const [isForm, setIsForm] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			color: ""
		}
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const payload = {
			names: [values.name]
		};

		await apiFetch(`/games/${gameId}/teams`, {
			method: "POST",
			body: JSON.stringify(payload),
		});

		form.reset({
			name: "",
			color: "",
		});

		setIsForm(false);
	}

	return (
		<div className={cn("bg-muted border-dashed border-4 rounded-md border-accent flex justify-center items-center py-3 px-1", className)}>
			{
				isForm ? (
					<form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-between gap-4 w-full pr-4">
						<FieldGroup>
							<Controller
								control={form.control}
								name="name"
								render={({ field, fieldState}) => (
									<Field data-invalid={fieldState.invalid}>
										<Input
											{...field}
											id={field.name}
											placeholder={"Red Team"}
											aria-invalid={fieldState.invalid}
											required
										/>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</FieldGroup>
						<ButtonGroup>
							<Button variant={"default"} size={"icon"} type="submit"><Check /></Button>
							<Button variant={"destructive"} size={"icon"} onClick={() => setIsForm(false)}><X /></Button>
						</ButtonGroup>
					</form>
				) : (
					<Button size="icon-lg" variant="ghost" onClick={() => setIsForm(true)}>
						<Plus />
					</Button>
				)
			}
			
			
		</div>
	);
}