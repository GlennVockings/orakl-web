import { DialogTrigger } from "@radix-ui/react-dialog"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp"

export const JoinGameDialog = () => {
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
				<div className="flex justify-center py-4">
					<InputOTP maxLength={6}>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
						</InputOTPGroup>
					</InputOTP>
				</div>
				<DialogFooter className="pt-6">
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button>Join game</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}