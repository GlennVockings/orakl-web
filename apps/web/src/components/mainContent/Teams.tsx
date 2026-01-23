import { UserX } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "../ui/empty"
import { Button } from "../ui/button"

const teams = [
	{
		id: 1,
		name: "Team 1",
		description: "",
		members: [
			{
				name: "User 1"
			},
			{
				name: "User 2"
			},
			{
				name: "User 10"
			},
			{
				name: "User 11"
			}
		]
	},
	{
		id: 2,
		name: "Team 2",
		description: "",
		members: [
			{
				name: "User 3"
			},
			{
				name: "User 4"
			},
			{
				name: "User 9"
			}
		]
	},
	{
		id: 3,
		name: "Team 3",
		description: "",
		members: [
			{
				name: "User 5"
			},
			{
				name: "User 6"
			},
			{
				name: "User 7"
			},
			{
				name: "User 8"
			}
		]
	}
]

export const Teams = () => {
	return (
		<div className="p-3 bg-muted/50 rounded-lg shadow-md shadow-accent/50">
				{
					teams.length > 0 ? (
						<>
						<p className="tracking-wide font-semibold text-lg underline pb-2">Teams</p>
						<div className="grid grid-cols-3 gap-2">
							{
								teams.map((team) => {
									return (
										<Card key={team.id}>
											<CardHeader>
												<CardTitle className="text-center">{ team.name }</CardTitle>
												<CardDescription>{ team.description }</CardDescription>
											</CardHeader>
											<CardContent className="flex flex-wrap gap-4">
												{
													team.members.map(member => {
														return <div key={member.name}>{ member.name }</div>
													})
												}
											</CardContent>
										</Card>
									)
								})
							}
						</div>
					</>
				) : (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant={"icon"}>
									<UserX />
								</EmptyMedia>
								<EmptyTitle>No teams yet</EmptyTitle>
								<EmptyDescription>
									No teams set up yet
								</EmptyDescription>
								<EmptyContent>
									<Button>Create team</Button>
								</EmptyContent>
							</EmptyHeader>
						</Empty>
					)
				}
		</div>
	)
} 