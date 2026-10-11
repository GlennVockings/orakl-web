import type { ReactNode } from "react";

import { OraklNavigation } from "@/components/navigation/OraklNavigation";

type NodeShellProps = {
  children: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
};

export const NodeShell = ({
  children,
  eyebrow,
  title,
  description,
  actions,
}: NodeShellProps) => {
  return (
    <main
      className="
        min-h-screen
        bg-[#09090b]
        px-4
        pb-4
        pt-24
        text-white
        sm:px-6
        sm:pb-6
        md:pt-28
        lg:px-8
        lg:pb-8
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1600px]
        "
      >
        <OraklNavigation
          className="
            absolute
            bottom-full
            left-0
            z-50
            mb-4
            w-full
          "
          desktopClassName="w-full"
        />

        <div
          className="
            min-h-[calc(100vh-7rem)]
            w-full
            overflow-hidden
            rounded-[28px]
            border
            border-white/[0.16]
            bg-white/[0.01]
            shadow-[0_30px_90px_rgba(0,0,0,0.42)]
            backdrop-blur-[8px]
            backdrop-saturate-[1.08]
            sm:rounded-[32px]
          "
        >
          <header
            className="
              flex
              flex-col
              gap-6
              border-b
              border-white/[0.08]
              px-6
              py-6
              sm:px-8
              lg:flex-row
              lg:items-end
              lg:justify-between
              lg:px-10
              lg:py-8
            "
          >
            <div className="min-w-0">
              {eyebrow ? (
                <p
                  className="
                    mb-2
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-white/40
                  "
                >
                  {eyebrow}
                </p>
              ) : null}

              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-white
                  sm:text-4xl
                "
              >
                {title}
              </h1>

              {description ? (
                <p
                  className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-6
                    text-white/50
                    sm:text-base
                  "
                >
                  {description}
                </p>
              ) : null}
            </div>

            {actions ? (
              <div className="flex shrink-0 items-center gap-3">{actions}</div>
            ) : null}
          </header>

          <div
            className="
              px-6
              py-6
              sm:px-8
              lg:px-10
              lg:py-8
            "
          >
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};
