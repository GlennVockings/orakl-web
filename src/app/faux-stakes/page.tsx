import { PageContainer } from "@/components";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { HandCoins, Percent, Shield, TrendingUpDown, Trophy, UserPlus } from "lucide-react";

export default function FauxStakes() {
  return (
    <div data-product="faux-stakes">

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-surface py-20 sm:py-28">
        <PageContainer className="flex flex-col gap-6">
          <div className="max-w-3xl">
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
              Predict. Compete. <span className="text-primary">Connect.</span>
            </h1>
          </div>

          <p className="max-w-xl text-muted-foreground text-lg">
            Make predictions. Set ridiculous odds. Prove you were right. A fake-stakes game built for friends, chaos, and bragging rights.
          </p>

          <div className="gap-4 hidden md:flex">
            <Button size="lg">Create a League</Button>
          </div>

          <Button size="xl" className="w-full md:hidden">Create a League</Button>
        </PageContainer>
      </section>

      {/* Carousel / Info Cards */}
      <section className="bg-background py-24 sm:py-32">
        <PageContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Card */}
          <div 
            className={[
              "group relative flex min-h-96 flex-col overflow-hidden rounded-2xl border p-8",
              "bg-card shadow-sm",
              "transition-[transform,background-color,border-color,box-shadow] duration-300",
              "hover:-translate-y-1 hover:border-primary/40 hover:bg-accent hover:shadow-md",
              "focus-visible:-translate-y-1 focus-visible:border-primary/40 focus-visible:bg-accent",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            ].join(" ")}
          >
            {/* <div className="absolute inset-x-0 top-0 left-1/2 h-1 origin-left scale-x-0 bg-primary transition-all duration-300 group-hover:scale-x-100 group-hover:left-0 group-focus-visible:scale-x-100" /> */}
            
            <div className="mt-auto">
              <h3 className="text-3xl font-semibold tracking-tight">Set the odds</h3>
              <p className="mt-4 max-w-md leading-7 text-muted-foreground transition-colors duration-300 group-hover:text-foreground group-focus-visible:text-foreground">
                Decide the outcomes, make the lines fair or completely unhinged.
                Your league, your rules.
              </p>
            </div>
          </div>
          
          {/* Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl p-6 border-l-4 border-primary">
            <div className="flex justify-center flex-col items-start gap-4">
              <Trophy color="#2CE6FF" />
              <p className="uppercase  text-lg">Back yourself</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground/80">
                Put your chips where your mouth is.
                Wins feel good. Receipts feel better.
              </p>
            </div>
          </div>
          {/* Card */}
          <div className="bg-card text-card-foreground flex flex-col gap-4 rounded-xl p-6 border-l-4 border-primary">
            <div className="flex justify-center flex-col items-start gap-4">
              <Shield color="#2CE6FF" />
              <p className="uppercase  text-lg">No real stakes</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground/80">
                No money involved. No deposits. No losses.
                Just pride on the line.
              </p>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* HOW IT WORKS */}
      <div className="py-6">
        <div className="w-96 h-40 bg-primary/8 absolute left-1/2 -translate-x-1/2 blur-3xl rounded-b-full"></div>
        <h2 className="text-4xl mb-6 uppercase ">How it <span className="text-primary">works</span></h2>

        <div className="h-14 flex gap-4 items-center mb-6">
          <Separator orientation={"vertical"} className="bg-primary" />
          <p className="text-white/60">A simple game: make predictions, commit your chips, and see who comes out on top.</p>
        </div>

        <div className="flex flex-col gap-4">
          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <UserPlus color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase  text-xs">Step 01</p>
              <ItemTitle>Join a League</ItemTitle>
              <ItemDescription>Create one with friends or jump into an existing game. The more opinions, the better.</ItemDescription>
            </ItemContent>
          </Item>

          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <HandCoins color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase  text-xs">Step 02</p>
              <ItemTitle>Get Your Chips</ItemTitle>
              <ItemDescription>
                Everyone starts with the same stack.
                What you do with it is up to you.
              </ItemDescription>
            </ItemContent>
          </Item>

          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <TrendingUpDown color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase  text-xs">Step 03</p>
              <ItemTitle>Make Your Picks</ItemTitle>
              <ItemDescription>
                Choose an outcome, back it with chips, and lock it in.
                No changing your mind later.
              </ItemDescription>
            </ItemContent>
          </Item>

          <Item variant={"muted"}>
            <ItemMedia variant="icon">
              <TrendingUpDown color="#0C0D1B" />
            </ItemMedia>
            <ItemContent className="gap-2">
              <p className="text-primary uppercase  text-xs">Step 04</p>
              <ItemTitle>Watch It Play Out</ItemTitle>
              <ItemDescription>
                When results come in, chips move and the table updates.
                Climb the leaderboard or fall trying.
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>
      </div>

      <div className="bg-accent mt-6 py-8 text-center rounded-md">
        <h2 className="text-3xl uppercase  mb-4">
          Ready to <span className="text-accent-foreground">prove it?</span>
        </h2>
        <Button size="lg">Start a League</Button>
      </div>

    </div>
  )
}