"use client";

import { useEffect } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { NodeEntrance } from "@/components/nodes/NodeEntrance";
import { NodeShell } from "@/components/nodes/NodeShell";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const AccountNode = () => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/auth");
    }
  }, [isPending, router, session]);

  const handleSignOut = async () => {
    await authClient.signOut();

    router.replace("/auth");
    router.refresh();
  };

  if (isPending) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#050507]
          text-white
        "
      >
        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-[0.22em]
            text-white/40
          "
        >
          Entering Orakl
        </p>
      </main>
    );
  }

  if (!session) {
    return <main className="min-h-screen bg-[#050507]" />;
  }

  const user = session.user;

  return (
    <NodeEntrance label="Account">
      <NodeShell
        eyebrow="Orakl / Account"
        title={`Welcome back, ${user.name}.`}
        description="Your games, predictions and Orakl activity live here."
        actions={
          <Button
            type="button"
            variant="ghost"
            onClick={handleSignOut}
            className="
              rounded-full
              border
              border-white/[0.12]
              bg-white/[0.04]
              px-4
              text-white/60
              hover:bg-white/[0.08]
              hover:text-white
            "
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Button>
        }
      >
        <div
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_280px]
          "
        >
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p
                  className="
                    text-xs
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white/35
                  "
                >
                  Your Orakl
                </p>

                <h2
                  className="
                    mt-2
                    text-xl
                    font-medium
                    tracking-[-0.02em]
                    text-white
                  "
                >
                  Your games
                </h2>
              </div>
            </div>

            <div
              className="
                mt-5
                border-y
                border-white/[0.08]
                py-10
              "
            >
              <p className="text-sm font-medium text-white/70">No games yet.</p>

              <p
                className="
                  mt-2
                  max-w-lg
                  text-sm
                  leading-6
                  text-white/40
                "
              >
                Games you create or join will appear here.
              </p>
            </div>
          </section>

          <aside
            className="
              border-t
              border-white/[0.08]
              pt-6
              lg:border-l
              lg:border-t-0
              lg:pl-8
              lg:pt-0
            "
          >
            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.18em]
                text-white/35
              "
            >
              Account
            </p>

            <dl className="mt-5 space-y-5">
              <div>
                <dt className="text-xs text-white/30">Name</dt>

                <dd className="mt-1 text-sm text-white/75">{user.name}</dd>
              </div>

              <div>
                <dt className="text-xs text-white/30">Email</dt>

                <dd
                  className="
                    mt-1
                    break-all
                    text-sm
                    text-white/75
                  "
                >
                  {user.email}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-white/30">Status</dt>

                <dd
                  className="
                    mt-1
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-white/75
                  "
                >
                  <span
                    className="
                      size-1.5
                      rounded-full
                      bg-emerald-400
                    "
                    aria-hidden="true"
                  />
                  Authenticated
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </NodeShell>
    </NodeEntrance>
  );
};
