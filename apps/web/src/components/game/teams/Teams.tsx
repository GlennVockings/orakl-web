"use client"

import { useGameMe, useTeams } from "@/hooks"
import { Spinner } from "../../ui/spinner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../ui/sheet";
import { Button } from "../../ui/button";
import { EditTeam } from "./EditTeam";
import { AddTeam } from "./AddTeam";

export const Teams = ({ gameId } : { gameId: string }) => {
	const { teams, teamsLoading, error } = useTeams(gameId);
	const { gameMe, isLoading } = useGameMe(gameId);

	if (teamsLoading || isLoading) {
    return <div className="p-2"><Spinner /> Loading teams...</div>;
  }

  if (error) {
    return <div className="p-2">Failed to load teams.</div>;
  }

	return (
		<div>
			<Sheet>
				<SheetTrigger asChild>
					<Button size={"lg"}>Teams</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Teams</SheetTitle>
					</SheetHeader>
						<div className="p-4 flex flex-col gap-4">
							{
								teams.map((team) => {
									return (
										<EditTeam key={team.id} team={team} gameId={gameId} />
									)
								})
							}
							<AddTeam className={ gameMe?.isAdmin ? "" : "hidden" } gameId={gameId} />
						</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}