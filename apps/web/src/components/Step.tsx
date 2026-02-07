import * as React from "react";
import { cn } from "@/lib/utils";

type StepProps = {
  icon: React.ReactNode;
  title: string;
  text: string;
  stepNumber?: number;
  className?: string;
};

export function Step({ icon, title, text, stepNumber, className }: StepProps) {
  return (
    <div className={cn("rounded-xl border bg-card py-4 px-5 shadow-sm", className)}>
      <div className="flex items-center gap-4">
        <div className="relative flex h-11 min-w-11 items-center justify-center rounded-full bg-muted">
          <div className="text-foreground">{icon}</div>
          {typeof stepNumber === "number" ? (
            <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-xs font-semibold">
              {stepNumber}
            </span>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="font-semibold leading-none">{title}</p>
          <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}
