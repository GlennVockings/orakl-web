import { TicketX } from "lucide-react"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty"

export const Bets = () => {
	return (
		<div className="p-3 bg-muted/50 rounded-lg shadow-md shadow-accent/50">
			{/* <p className="tracking-wide font-semibold text-lg underline pb-2">Bets</p>
			<div className="grid grid-cols-3 gap-2">
			</div> */}
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant={"icon"}>
							<TicketX />
						</EmptyMedia>
						<EmptyTitle>No bets yet</EmptyTitle>
						<EmptyDescription>
							Switch over to the market tab and get your crystal ball out and get betting
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
		</div>
	)
}