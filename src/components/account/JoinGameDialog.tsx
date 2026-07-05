"use client"

import { DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError, FieldGroup } from "../ui/field"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { apiFetch } from "@/lib/api"
import { Game, Membership } from "@/lib/types"
import { useRouter } from "next/navigation"

const formSchema = z.object({
	joinCode: z.string().min(6)
})

interface JoinRes {
	game: Game
	membership: Membership
}

export const JoinGameDialog = () => {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			joinCode: ""
		}
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const game = await apiFetch<JoinRes>("/games/join", {
			method: "POST",
			body: JSON.stringify({ joinCode: values.joinCode.toUpperCase()})
		})

		if (game?.game.id) {
			router.push(`/game/${game?.game.id}`)
			router.refresh();
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>
					Join game
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-center">Join game</DialogTitle>
					<DialogDescription className="text-center">Enter the join code to raise the stakes</DialogDescription>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FieldGroup>
						<Controller
							control={form.control}
							name="joinCode"
							render={({ field, fieldState}) => (
								<Field data-invalid={fieldState.invalid}>
									<InputOTP {...field} id={field.name} maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
										<InputOTPGroup>
											<InputOTPSlot index={0} />
											<InputOTPSlot index={1} />
											<InputOTPSlot index={2} />
											<InputOTPSlot index={3} />
											<InputOTPSlot index={4} />
											<InputOTPSlot index={5} />
										</InputOTPGroup>
									</InputOTP>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</FieldGroup>
					<DialogFooter className="pt-6">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit">Join game</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}