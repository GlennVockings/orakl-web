"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"

const formSchema = z.object({
	email: z.string(),
	password: z.string().min(2, {
        message: "Password must be at least 2 characters"
    })
})

export const LogInForm = () => {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "alice@example.com",
			password: "password123"
		}
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await authClient.signIn.email({ ...values });

		router.push("/account");
		router.refresh();
	}

	async function getSession() {
    const session = await authClient.getSession();
  }
	
	return (
		<div>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<Controller
						control={form.control}
						name="email"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Email</FieldLabel>
								<Input 
									{...field} 
									id={field.name}
									aria-invalid={fieldState.invalid} 
									/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
					<Controller
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Password</FieldLabel>
								<Input 
									{...field} 
									type="password"
									id={field.name}
									aria-invalid={fieldState.invalid} 
									/>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</FieldGroup>
				<Button type="submit">Log in</Button>
			</form>

			<button onClick={getSession}>Get session</button>
		</div>
	)
}