"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { MobileOraklNav } from "./MobileOraklNav";
import { OraklNav } from "./OraklNav";

type OraklNavigationProps = {
  className?: string;
  desktopClassName?: string;
  showDesktop?: boolean;
  showMobile?: boolean;
};

export const OraklNavigation = ({
  className = "",
  desktopClassName = "",
  showDesktop = true,
  showMobile = true,
}: OraklNavigationProps) => {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user =
    !isPending && session?.user
      ? {
          name: session.user.name,
          image: session.user.image ?? null,
        }
      : null;

  const handleSignOut = async () => {
    await authClient.signOut();

    router.replace("/auth");
    router.refresh();
  };

  return (
    <div className={className}>
      {showDesktop ? (
        <OraklNav
          className={desktopClassName}
          user={user}
          onSignOut={handleSignOut}
        />
      ) : null}

      {showMobile ? (
        <MobileOraklNav user={user} onSignOut={handleSignOut} />
      ) : null}
    </div>
  );
};
