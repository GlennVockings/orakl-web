"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const formSchema = z.object({
	email: z.string(),
	password: z.string().min(2, {
    message: "Password must be at least 2 characters"
  }),
	name: z.string().min(2, {
		message: "Name must be be at least 2 characters"
	})
})

export const SignUpForm = () => {
	const router = useRouter();
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			name: "",
		}
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)

		await authClient.signUp.email({ ...values })

		router.push("/account");
		router.refresh();
	}
	
	return (
		<div>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-7">
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
						<Controller
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel htmlFor={field.name}>Name</FieldLabel>
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
				<Button type="submit">Sign up</Button>
			</form>
		</div>
	)
}