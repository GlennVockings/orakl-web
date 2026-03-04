import Link from "next/link";
import ThemeToggle from "../theme-toggle";
import { AccountButton } from "./AccountButton";

export const SiteHeader = () => {
  return (
    <header className="border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-black text-xl">
            *
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Faux Stakes
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
              no real wagers
            </span>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <AccountButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}