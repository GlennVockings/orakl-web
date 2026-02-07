import { Step } from "@/components";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, Percent, Trophy, CircleStar } from "lucide-react";


export default function Hiw() {
	return (
		<div className="py-3">
			
			<div>
				<h1 className="text-4xl font-bold">How It Works</h1>
				<p className="mt-3 text-muted-foreground max-w-xl">
					A fake betting game for real competition. No money. No gambling.
				</p>
			</div>

			<Separator />

			<div className="mt-10 rounded-xl border bg-muted p-6 grid grid-cols-2 gap-6">
				<div>
					<p className="font-semibold mb-2">✅ What this is</p>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>• A game using fake money</li>
						<li>• Competition with friends</li>
						<li>• Custom odds and leaderboards</li>
					</ul>
				</div>
				<div>
					<p className="font-semibold mb-2">❌ What this is not</p>
					<ul className="text-sm text-muted-foreground space-y-1">
						<li>• Real betting</li>
						<li>• Gambling</li>
						<li>• A way to win money</li>
					</ul>
				</div>
			</div>

			<Separator />

			<div className="my-16 grid grid-cols-4 gap-4">
				<Step
					icon={<Users />}
					title="Create a league"
					text="Start a private league and invite friends."
				/>
				<Step
					icon={<Percent />}
					title="Set the odds"
					text="Anyone can create lines for upcoming events."
				/>
				<Step
					icon={<CircleStar />}
					title="Place fake bets"
					text="Use fictional credits — no real money involved."
				/>
				<Step
					icon={<Trophy />}
					title="Climb the leaderboard"
					text="Track wins, streaks, and bragging rights."
				/>
			</div>

			<Separator />

			<div className="mt-20 grid grid-cols-2 gap-12">
				<div>
					<h3 className="text-xl font-semibold">Custom chaos</h3>
					<p className="text-muted-foreground mt-2">
						Set serious odds or ridiculous ones. The league decides what’s fair.
					</p>
				</div>

				<div>
					<h3 className="text-xl font-semibold">Stats worth bragging about</h3>
					<p className="text-muted-foreground mt-2">
						Track streaks, biggest wins, and worst calls.
					</p>
				</div>
			</div>

			<div className="mt-20 rounded-lg border p-4 text-sm text-muted-foreground">
				This platform does not involve real money or gambling and is intended for
				entertainment purposes only. If gambling is affecting you or someone you
				know, please seek support from organizations like BeGambleAware or the
				National Council on Problem Gambling.
			</div>

			<div className="mt-20 text-center">
				<Button size="lg">Create a League</Button>
			</div>

		</div>
	)
}