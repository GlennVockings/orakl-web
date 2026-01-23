import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Info, Percent, Shield, Trophy } from "lucide-react";
import { Gorditas } from "next/font/google";


const gorditas = Gorditas({
  variable: "--font-gorditas",
  subsets: ["latin"],
  weight: "700"
});

export default function Home() {
  return (
    <div className="py-3">

      {/* GAMBLING DISCLAIMER */}
      <div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
        <Info className="h-4 w-4 mt-0.5" />
        <p>
          <strong>Important:</strong> This platform does <strong>not</strong> involve real money,
          does <strong>not</strong> facilitate or encourage gambling, and is intended
          for <strong>entertainment purposes only</strong>.
        </p>
        <p className="mt-2">
          If gambling is affecting you or someone you know, help is available.
          Visit{" "}
          <a
            href="https://www.begambleaware.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            BeGambleAware
          </a>{" "}
          or{" "}
          <a
            href="https://www.ncpgambling.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            the National Council on Problem Gambling
          </a>{" "}
          for free, confidential support.
        </p>
      </div>

      {/* Hero */}
      <div className="flex flex-col gap-6 py-16">
        <div>
          <p className={cn("text-5xl text-primary whitespace-nowrap", gorditas.className)}>
            THE COMPETITION IS REAL
          </p>
          <p className={cn("text-3xl text-foreground whitespace-nowrap", gorditas.className)}>
            BUT THE MONEY IS FAKE
          </p>
        </div>

        <p className="max-w-xl text-muted-foreground text-lg">
          Create custom odds, place fake bets with friends, and climb the leaderboard.
          No risk. All bragging rights.
        </p>

        <div className="flex gap-4">
          <Button size="lg">Create a League</Button>
          <Button size="lg" variant="outline">See How It Works</Button>
        </div>
      </div>

      <Separator />

      {/* Carousel / Info Cards */}
      <div className="py-7">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary text-primary-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="flex justify-center flex-col items-center gap-3">
              <Percent />
              <p className="font-semibold tracking-wide">Create the odds</p>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80 text-center px-6">
                Set your own lines for matches, events, or ridiculous outcomes.
                House rules are yours.
              </p>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="flex justify-center flex-col items-center gap-3">
              <Trophy />
              <p className="font-semibold tracking-wide">Earn bragging rights</p>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80 text-center px-6">
                Track wins, streaks, and leaderboards.
                Screenshots encouraged. Excuses not accepted.
              </p>
            </div>
          </div>
          <div className="bg-primary text-primary-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
            <div className="flex justify-center flex-col items-center gap-3">
              <Shield />
              <p className="font-semibold tracking-wide">Zero risk</p>
            </div>
            <div>
              <p className="text-sm text-primary-foreground/80 text-center px-6">
                No real money. No deposits. No regret.
                Just competition with friends.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* HOW IT WORKS */}
      <div className="py-16">
        <h2 className="text-3xl font-bold mb-10">How it works</h2>

        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-xl font-semibold mb-2">1. Create a league</p>
            <p className="text-muted-foreground">
              Invite friends and choose what you’re betting on — sports, events, or chaos.
            </p>
          </div>

          <div>
            <p className="text-xl font-semibold mb-2">2. Set the odds</p>
            <p className="text-muted-foreground">
              You’re the bookmaker. Decide the lines and let everyone react.
            </p>
          </div>

          <div>
            <p className="text-xl font-semibold mb-2">3. Climb the board</p>
            <p className="text-muted-foreground">
              Fake money bets, real rankings, eternal trash talk.
            </p>
          </div>
        </div>
      </div>

      <div className="py-12 bg-muted rounded-xl">
        <p className="text-center text-xl italic">
          “I’m up 10,000 fake dollars and I won’t shut up about it.”
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          — Everyone, eventually
        </p>
      </div>

      <div className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to prove you know ball?
        </h2>
        <p className="text-muted-foreground mb-6">
          Or at least talk like you do.
        </p>
        <Button size="lg">Start a League</Button>
      </div>

    </div>
  )
}