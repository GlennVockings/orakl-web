import ThemeToggle from "./theme-toggle";
import UserModal from "./user-modal";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
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
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
					<UserModal />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}