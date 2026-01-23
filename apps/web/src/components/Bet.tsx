import { PiggyBank } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export const Bet = () => {
	return (
		<div className="p-3 bg-muted/50 rounded-lg relative shadow-md shadow-accent/50 flex flex-col gap-3">
			<p className="tracking-wide font-semibold text-lg underline text-center pb-2">Bet</p>
			<div className="flex justify-center items-center min-h-20 border-dashed border border-muted-foreground bg-muted rounded-lg">
				<p className="tracking-wide">No event selected</p>
			</div>
			<div className="flex items-center bg-muted rounded-lg p-3 gap-1">
				<PiggyBank />
				<p>Budget:</p>
				<p>2000</p>
			</div>
			<div className="flex gap-3">
				<Button disabled={true}>Bet</Button>
				<Input type="number" placeholder="Bet amount" />
			</div>
		</div>
	)
}