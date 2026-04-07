"use client"

import useSWR from "swr";
import { ScrollArea } from "../ui/scroll-area"
import { ChevronDown, User } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LeaderboardEntry } from "@/lib/types";

const fetcher = (gameId: string) =>
	apiFetch<LeaderboardEntry[]>(`/games/${gameId}/leaderboard`, {
		method: "GET",
	})

export const Leaderboard = ({ gameId } : { gameId: string }) => {
	const { data: leaderboard, error, isLoading } = useSWR(
    ["leaderboard", gameId],
    ([, id]) => fetcher(id),
    {
      revalidateOnFocus: false,
    }
  );

  if (isLoading) {
    return <div className="p-2">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="p-2">Failed to load leaderboard.</div>;
  }

	return (
		<div className="rounded-lg relative">
			<p className="text-lg font-[Space_Grotesk] uppercase">Leaderboard</p>
			<Tabs defaultValue="settledBalance" className="py-4 gap-4">
				<TabsList className="bg-accent">
					<TabsTrigger value="settledBalance">Leaderboard</TabsTrigger>
					<TabsTrigger value="currentBalance">Current Balance</TabsTrigger>
				</TabsList>
				<TabsContent value="settledBalance">
					<ScrollArea className="max-h-[500px] w-full rounded-md">
						<div className="flex flex-col gap-2">
							{
								leaderboard?.map((entry) => (
									<div key={entry.userId} className="bg-accent flex items-center p-4 rounded-md">
										<div className="font-[Space_Grotesk] pr-5">
											<p className="text-2xl">{ String(entry.rank).padStart(2, "0") }</p>
										</div>
										<div className="flex-grow text-white font-bold">
											<p>{ entry.displayName }</p>
										</div>
										<div className="text-primary font-bold">
											<p>{ entry.settledBalance }</p>
										</div>
									</div>
								))
							}
						</div>
					</ScrollArea>
				</TabsContent>
				<TabsContent value="currentBalance">
					<ScrollArea className="max-h-[500px] w-full rounded-md">
						<div className="flex flex-col gap-2">
							{
								leaderboard?.map((entry) => (
									<div key={entry.userId} className="bg-accent flex items-center p-4 rounded-md">
										<div className="font-[Space_Grotesk] pr-6">
											<User />
										</div>
										<div className="flex-grow text-white font-bold">
											<p>{ entry.displayName }</p>
										</div>
										<div className="text-primary font-bold">
											<p>{ entry.currentBalance }</p>
										</div>
									</div>
								))
							}
						</div>
					</ScrollArea>
				</TabsContent>
			</Tabs>
			<div className="absolute bottom-0 left-0 w-full h-12 rounded-b-lg bg-linear-to-t from-black to-transparent opacity-0">
				<div className="flex justify-center items-center h-full opacity-50">
					<ChevronDown color="#FFF" size={40} />
				</div>
			</div>
		</div>
	)
}