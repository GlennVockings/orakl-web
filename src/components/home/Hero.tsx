import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { OraklMark } from "../brand"
import { PageContainer } from "../layout"
import { HeroEnergyField } from "./HeroEnergyField"

export const HomeHero = () => {
  return (
    <section className="relative isolate overflow-hidden border-b bg-surface py-20 sm:py-28">
      <HeroEnergyField className="-z-10" />
      
      <PageContainer className="relative flex flex-col items-start gap-12 z-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Social competition, made simple
          </p>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] sm:text-7xl">
            Predict. Compete. <span className="text-primary">Connect.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Orakl brings friends, colleagues and communities together through competitive games built around the events they already care about.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Get started <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/account">View your games</Link>
            </Button>
          </div>
        </div>
        <div className="flex w-full justify-center lg:w-auto">
          <OraklMark className="h-48 w-48 sm:h-64 sm:w-64 text-brand" />
        </div>
      </PageContainer>
    </section>
  )
}