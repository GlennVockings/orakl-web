import { CalendarX } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty"
import { Event } from "./Event"
import { Button } from "../ui/button"

const events = [
	{
		id: 1,
		name: "Egg and Spoon",
		description: "Classic race",
		status: "Preview",
		teams: [
			{
				team: "Team 1",
				odds: "5/1"
			},
			{
				team: "Team 2",
				odds: "2/1" 
			},
			{
				team: "Team 3",
				odds: "4/3",
			}
		]
	},
	{
		id: 2,
		name: "Sack Race",
		description: "Classic race",
		status: "Open",
		teams: [
			{
				team: "Team 1",
				odds: "5/1"
			},
			{
				team: "Team 2",
				odds: "2/1" 
			},
			{
				team: "Team 3",
				odds: "4/3",
			}
		]
	},
	{
		id: 3,
		name: "3 legged Race",
		description: "Classic race",
		status: "Closed",
		teams: [
			{
				team: "Team 1",
				odds: "5/1"
			},
			{
				team: "Team 2",
				odds: "2/1" 
			},
			{
				team: "Team 3",
				odds: "4/3",
			}
		]
	},
	{
		id: 4,
		name: "Skipping Rope Race",
		description: "Classic race",
		status: "Finished",
		teams: [
			{
				team: "Team 1",
				odds: "5/1"
			},
			{
				team: "Team 2",
				odds: "2/1" 
			},
			{
				team: "Team 3",
				odds: "4/3",
			}
		]
	}
]

export const NewLookMarket = () => {
	return (
		<div className="p-3 bg-muted/50 rounded-lg shadow-md shadow-white/20">
			<p className="tracking-wide font-semibold text-lg underline pb-2">Markets</p>
			<div className="grid grid-cols-3 gap-2">
				{
					events.map(event => {
						return <Event key={event.id} {...event} /> 
					})
				}
			</div>
			{/* <Empty>
				<EmptyHeader>
					<EmptyMedia variant={"icon"}>
						<CalendarX />
					</EmptyMedia>
					<EmptyTitle>No events yet</EmptyTitle>
					<EmptyDescription>
						Wait for the admin to set some up
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button>Create event</Button>
				</EmptyContent>
			</Empty> */}
		</div>
	)
} 