import { Table, TableBody, TableHead, TableHeader, TableRow } from "./ui/table"
import { LeaderboardRow } from "./LeaderboardRow"
import { ReactHTMLElement, ReactNode } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { ChevronDown, ChevronUp } from "lucide-react"

const leaderboardDummy = [
	{
		pos: 1,
		name: "User 1",
		budget: 2000,
		prevPos: 2,
	},
	{
		pos: 2,
		name: "User 2",
		budget: 2000,
		prevPos: 1,
	},
	{
		pos: 3,
		name: "User 3",
		budget: 2000,
		prevPos: 3,
	},
	{
		pos: 4,
		name: "User 4",
		budget: 2000,
		prevPos: 4,
	},
	{
		pos: 5,
		name: "User 5",
		budget: 2000,
		prevPos: 8,
	},
	{
		pos: 6,
		name: "User 6",
		budget: 2000,
		prevPos: 5,
	},
	{
		pos: 7,
		name: "User 7",
		budget: 2000,
		prevPos: 6,
	},
	{
		pos: 8,
		name: "User 8",
		budget: 2000,
		prevPos: 7,
	},
	{
		pos: 9,
		name: "User 9",
		budget: 2000,
		prevPos: 9,
	},
	{
		pos: 10,
		name: "User 10",
		budget: 2000,
		prevPos: 11,
	},
	{
		pos: 11,
		name: "User 11",
		budget: 2000,
		prevPos: 10,
	},
	{
		pos: 12,
		name: "User 12",
		budget: 2000,
		prevPos: 12,
	},
	{
		pos: 13,
		name: "User 13",
		budget: 2000,
		prevPos: 13,
	},
	{
		pos: 14,
		name: "User 14",
		budget: 2000,
		prevPos: 14,
	},
	{
		pos: 15,
		name: "User 15",
		budget: 2000,
		prevPos: 15,
	},
	{
		pos: 16,
		name: "User 16",
		budget: 2000,
		prevPos: 16,
	},
	{
		pos: 17,
		name: "User 17",
		budget: 2000,
		prevPos: 18,
	},
	{
		pos: 18,
		name: "User 18",
		budget: 2000,
		prevPos: 17,
	},
	{
		pos: 19,
		name: "User 19",
		budget: 2000,
		prevPos: 19,
	},
	{
		pos: 20,
		name: "User 20",
		budget: 2000,
		prevPos: 20,
	}
]

export const Leaderboard = () => {

	return (
		<div className="p-2 bg-muted/50 rounded-lg relative shadow-md shadow-accent/50">
			<p className="tracking-wide font-semibold text-lg underline text-center pb-2">Leaderboard</p>
			<ScrollArea className="h-[500px] w-full rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-10"></TableHead>
							<TableHead className="text-center w-12">Pos.</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Budget</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{leaderboardDummy.map((row) => (
							<LeaderboardRow key={row.pos} {...row} />
						))}
					</TableBody>
				</Table>
			</ScrollArea>
			<div className="absolute bottom-0 left-0 w-full h-12 rounded-b-lg bg-linear-to-t from-black to-transparent opacity-0">
				<div className="flex justify-center items-center h-full opacity-50">
					<ChevronDown color="#FFF" size={40} />
				</div>
			</div>
		</div>
	)
}