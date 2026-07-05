import Link from "next/link";
import { AccountButton } from "./AccountButton";

export const SiteHeader = () => {
  return (
    <header className="bg-background shadow-xl shadow-primary/5">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Brand */}
        <Link href="/" className="text-primary uppercase text-xl font-[Space_Grotesk]">
          Faux Stakes
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <AccountButton />
        </div>
      </div>
    </header>
  );
}