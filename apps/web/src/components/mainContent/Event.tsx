import { Ban, Circle, Crown, Minus } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export const Event = ({ name, description, status, teams } : { name: string, description: string, status: string, teams: { team: string, odds: string }[] }) => {
	function renderStatus(status: string) {
		switch(status) {
			case "Open":
				return (
					<Tooltip>
						<TooltipTrigger>
							<Button variant={"ghost"}><Circle color="#3aa813" /></Button>
						</TooltipTrigger>
						<TooltipContent>
							Open
						</TooltipContent>
					</Tooltip>
				);
			case "Closed":
				return (
					<Tooltip>
						<TooltipTrigger>
							<Button variant={"ghost"}><Ban color="#c40c0c" /></Button>
						</TooltipTrigger>
						<TooltipContent>
							Closed
						</TooltipContent>
					</Tooltip>
				);
			case "Finished":
				return (
					<Tooltip>
						<TooltipTrigger>
							<Button variant={"ghost"}><Crown color="#c7c234" /></Button>
						</TooltipTrigger>
						<TooltipContent>
							Finished
						</TooltipContent>
					</Tooltip>
				);
			default:
				return (
					<Tooltip>
						<TooltipTrigger>
							<Button variant={"ghost"}><Minus color="#c7c234" /></Button>
						</TooltipTrigger>
						<TooltipContent>
							Preview
						</TooltipContent>
					</Tooltip>
				);
				return 
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{ name }</CardTitle>
				<CardDescription>
					{ description }
				</CardDescription>
				<CardAction>
					{ renderStatus(status) }
				</CardAction>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="text-left">Team</TableHead>
							<TableHead className="text-right">Odds</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{
							teams.map(team => (
								<TableRow key={team.team}>
									<TableCell className="text-left">{ team.team }</TableCell>
									<TableCell className="text-right"><Button>{ team.odds }</Button></TableCell>
								</TableRow>
							))            
						}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}