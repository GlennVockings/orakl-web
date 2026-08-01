import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HomeCta() {
  return (
    <div className="rounded-3xl border border-border/60 bg-background/80 p-8 shadow-sm backdrop-blur-md sm:p-10 lg:p-14">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Ready to enter?
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Make your call and see where the knowledge leads.
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Choose an Orakl experience, compete with people you know and turn
          every opinion into something worth following.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/predictor">
              Enter Predictor
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link href="/faux-stakes">Explore Faux Stakes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
