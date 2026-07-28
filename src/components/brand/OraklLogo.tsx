import Link from "next/link";
import { cn } from "@/lib/utils";
import { OraklMark } from "./OraklMark";

type OraklLogoProps = {
  className?: string;
  href?: string;
};

export function OraklLogo({ className, href = "/" }: OraklLogoProps) {
  return (
    <Link className={cn("inline-flex items-center gap-2 text-foreground", className)} href={href}>
      <OraklMark className="text-primary" />
      <span className="font-semibold tracking-[-0.04em] text-xl">Orakl</span>
    </Link>
  );
}
