"use client"

import { ScrollArea } from "../ui/scroll-area"
import { ChevronDown, ChevronUp, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Spinner } from "../ui/spinner";
import { useLeaderboard } from "@/hooks";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export const Leaderboard = ({ gameId } : { gameId: string }) => {
	const { leaderboard, error, isLoading } = useLeaderboard(gameId)

	function renderDelta(delta: number) {
		if (delta > 0) {
			return (
				<ChevronUp size={18} color={"#00FF00"} />
			)
		} else if (delta < 0) {
			return (
				<ChevronDown size={18} color={"#FF0000"} />
			)
		} else {
			return (
				<div className="w-6 h-6"></div>
			)
		}
	}

  if (isLoading) {
    return <div className="p-2"><Spinner /> Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="p-2">Failed to load leaderboard.</div>;
  }

	return (
		<div className="rounded-lg relative">
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger asChild>
						<Button size={"lg"}>LeaderBoard</Button>
					</SheetTrigger>
					<SheetContent side={"left"} className="p-4">
						<SheetHeader>
							<SheetTitle>Leaderboard</SheetTitle>
						</SheetHeader>
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
												<div key={entry.userId} className="bg-accent flex items-center py-4 px-2 rounded-md">
													<div className="font-[Space_Grotesk] pr-3 flex gap-1 items-center">
														{ renderDelta(entry.rankDelta || 0) }
														<p className="text-2xl leading-none">{ String(entry.rank).padStart(2, "0") }</p>
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
					</SheetContent>
				</Sheet>
			</div>
			<div className="hidden md:block">
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
		</div>
	)
}