import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HandCoins, Info, Percent, Shield, TrendingUpDown, Trophy, UserPlus } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="my-10">

      {/* GAMBLING DISCLAIMER */}
      {/* <div className="mt-1 rounded-lg border bg-muted px-4 py-3 text-sm text-muted-foreground">
        <div className="flex gap-1">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            <strong>Important:</strong> This platform does <strong>not</strong> involve real money,
            does <strong>not</strong> facilitate or encourage gambling, and is intended
            for <strong>entertainment purposes only</strong>.
          </p>
        </div>
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
      </div> */}

      {/* Hero */}
      <div className="w-96 h-96 bg-primary/5 absolute left-1/2 -translate-x-1/2 blur-3xl rounded-b-full"></div>
      <div className="flex flex-col gap-6 py-6">
        <div>
          <p className={cn("text-5xl uppercase text-foreground whitespace-nowrap font-[Space_Grotesk]")}>
            Predict.
          </p>
          <p className={cn("text-5xl uppercase text-foreground whitespace-nowrap font-[Space_Grotesk]")}>
            Compete.
          </p>
          <p className={cn("text-5xl uppercase whitespace-nowrap font-[Space_Grotesk] text-primary")}>
            Climb.
          </p>
        </div>

        <p className="max-w-xl text-muted-foreground text-lg">
          Create custom odds, place fake bets with friends, and climb the leaderboard.
          No risk. All bragging rights.
        </p>

        <div className="gap-4 hidden md:flex">
          <Button size="lg">Create a League</Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/howitworks">See How It Works</Link>
          </Button>
        </div>

        <Button size="xl" className="w-full md:hidden">Create a League</Button>
      </div>

      {/* Carousel / Info Cards */}
      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl p-6 border-l-4 border-primary">
            <div className="flex justify-center flex-col items-start gap-4">
              <Percent color="#2CE6FF" />
              <p className="uppercase font-[Space_Grotesk] text-lg">Create the odds</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground/80">
                Set your own lines for matches, events, or ridiculous outcomes.
                House rules are yours.
              </p>
            </div>
          </div>
          {/* Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl p-6 border-l-4 border-primary">
            <div className="flex justify-center flex-col items-start gap-4">
              <Trophy color="#2CE6FF" />
              <p className="uppercase font-[Space_Grotesk] text-lg">Earn bragging rights</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground/80">
                Track wins, streaks, and leaderboards.
                Screenshots encouraged. Excuses not accepted.
              </p>
            </div>
          </div>
          {/* Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl p-6 border-l-4 border-primary">
            <div className="flex justify-center flex-col items-start gap-4">
              <Shield color="#2CE6FF" />
              <p className="uppercase font-[Space_Grotesk] text-lg">Zero risk</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground/80">
                No real money. No deposits. No regret.
                Just competition with friends.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="py-6">
        <div className="w-96 h-40 bg-primary/8 absolute left-1/2 -translate-x-1/2 blur-3xl rounded-b-full"></div>
        <h2 className="text-4xl mb-6 uppercase font-[Space_Grotesk]">How it <span className="text-primary">works</span></h2>

        <div className="h-14 flex gap-4 items-center mb-6">
          <Separator orientation={"vertical"} className="bg-primary" />
          <p className="text-white/60">A fun, competitive prediction game using virtual chips - no real money involved.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <UserPlus color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase font-[Space_Grotesk] text-xs">Step 01</p>
              <ItemTitle>Join a Game</ItemTitle>
              <ItemDescription>Enter high-stakes competitive leagues or quick casual games with the community.</ItemDescription>
            </ItemContent>
          </Item>

          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <HandCoins color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase font-[Space_Grotesk] text-xs">Step 02</p>
              <ItemTitle>Get Chips</ItemTitle>
              <ItemDescription>Every participant starts with a fresh stack of virtual credits to power their predictions.</ItemDescription>
            </ItemContent>
          </Item>

          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <TrendingUpDown color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase font-[Space_Grotesk] text-xs">Step 03</p>
              <ItemTitle>Make Predictions</ItemTitle>
              <ItemDescription>Analyze the market, evaluate odds, and place your virual chips on likely outcomes.</ItemDescription>
            </ItemContent>
          </Item>
        </div>
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