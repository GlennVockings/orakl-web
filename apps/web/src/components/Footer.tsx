import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Gorditas } from "next/font/google";

const gorditas = Gorditas({
	variable: "--font-gorditas",
	subsets: ["latin"],
	weight: "700"
});

export const Footer = () => {
	return (
		<footer className="mt-24 border-t pt-10 pb-6 max-w-6xl mx-auto flex flex-col">
			<div className="grid grid-cols-3 gap-8">
				{/* Brand / Disclaimer */}
				<div className="flex flex-col gap-3">
					<p className={cn("text-xl text-primary", gorditas.className)}>
						FAKE ODDS
					</p>
					<p className="text-sm text-muted-foreground max-w-xs">
						A fake betting game for real competition.
						No real money, no payouts, no gambling.
					</p>
					<p className="text-xs text-muted-foreground">
						For entertainment purposes only.
					</p>
				</div>

				{/* Navigation */}
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-semibold mb-1">Explore</p>
					<a className="hover:underline cursor-pointer">Create a League</a>
					<a className="hover:underline cursor-pointer">How It Works</a>
					<a className="hover:underline cursor-pointer">Leaderboards</a>
				</div>

				{/* Meta / Legal-ish */}
				<div className="flex flex-col gap-2 text-sm">
					<p className="font-semibold mb-1">Info</p>
					<a className="hover:underline cursor-pointer">Rules</a>
					<a className="hover:underline cursor-pointer">FAQ</a>
					<a className="hover:underline cursor-pointer">Contact</a>
				</div>
			</div>

			<Separator className="my-6" />

			<div className="flex justify-between text-xs text-muted-foreground">
				<p>© {new Date().getFullYear()} Fake Odds</p>
				<p>Built for trash talk, not transactions</p>
			</div>
		</footer>
	)
}
