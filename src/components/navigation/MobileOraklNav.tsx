"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, LogOut, Menu, UserRound } from "lucide-react";

import type { NavigationUser } from "./OraklNav";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const games = [
  {
    name: "Faux Stakes",
    href: "/faux-stakes",
    colour: "#F05A28",
    description: "Turn any event into a competition.",
  },
  {
    name: "Predictor",
    href: "/predictor",
    colour: "#0057FF",
    description: "Call real sport before it happens.",
  },
  {
    name: "Arena",
    href: "/arena",
    colour: "#8B5CF6",
    description: "Study the field. Pick your champion.",
  },
];

type MobileOraklNavProps = {
  user?: NavigationUser | null;
  onSignOut?: () => void;
};

export const MobileOraklNav = ({
  user = null,
  onSignOut,
}: MobileOraklNavProps) => {
  const pathname = usePathname();

  return (
    <div
      className="
        fixed
        left-4
        right-4
        top-4
        z-[100]
        md:hidden
      "
    >
      <Sheet>
        <div
          className="
            flex
            items-center
            justify-between

            rounded-[20px]

            border
            border-white/[0.14]

            bg-black/30

            px-4
            py-3

            shadow-[0_18px_60px_rgba(0,0,0,0.38)]

            backdrop-blur-[14px]
            backdrop-saturate-[1.08]
          "
        >
          <Link
            href="/"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white/20
            "
          >
            <span
              aria-hidden="true"
              className="
                flex
                size-8
                items-center
                justify-center

                rounded-full

                border
                border-white/20

                bg-white/[0.05]
              "
            >
              <span className="size-1.5 rounded-full bg-white/80" />
            </span>

            <span
              className="
                text-sm
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Orakl
            </span>
          </Link>

          <SheetTrigger
            className="
              flex
              size-10
              items-center
              justify-center

              rounded-xl

              border
              border-white/[0.12]

              bg-white/[0.05]

              text-white/80

              transition-colors

              hover:bg-white/[0.09]
              hover:text-white

              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white/20
            "
          >
            <Menu className="size-5" />

            <span className="sr-only">Open navigation</span>
          </SheetTrigger>
        </div>

        <SheetContent
          side="right"
          className="
            w-[min(88vw,380px)]

            border-l
            border-white/[0.14]

            bg-black/70

            px-5
            py-6

            text-white

            backdrop-blur-[22px]
            backdrop-saturate-[1.1]
          "
        >
          <SheetHeader className="text-left">
            <SheetTitle
              className="
                flex
                items-center
                gap-3

                text-white
              "
            >
              <span
                aria-hidden="true"
                className="
                  flex
                  size-8
                  items-center
                  justify-center

                  rounded-full

                  border
                  border-white/20

                  bg-white/[0.05]
                "
              >
                <span className="size-1.5 rounded-full bg-white/80" />
              </span>

              <span
                className="
                  text-sm
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                "
              >
                Orakl
              </span>
            </SheetTitle>
          </SheetHeader>

          <nav
            aria-label="Mobile navigation"
            className="
              mt-10
              flex
              flex-col
              gap-8
            "
          >
            {/* Home */}
            <div>
              <SheetClose asChild>
                <Link
                  href="/"
                  className={`
                    flex
                    min-h-12
                    items-center

                    rounded-2xl

                    px-4

                    text-base
                    font-medium

                    transition-colors

                    ${
                      pathname === "/"
                        ? "bg-white/[0.07] text-white"
                        : "text-white/65 hover:bg-white/[0.05] hover:text-white"
                    }
                  `}
                >
                  Home
                </Link>
              </SheetClose>
            </div>

            {/* Games */}
            <div className="flex flex-col gap-3">
              <p
                className="
                  px-4

                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.2em]
                  text-white/30
                "
              >
                Games
              </p>

              <div className="flex flex-col gap-1">
                {games.map((game) => {
                  const active = pathname.startsWith(game.href);

                  return (
                    <SheetClose asChild key={game.name}>
                      <Link
                        href={game.href}
                        className={`
                          group

                          relative

                          flex
                          min-h-16
                          flex-col
                          justify-center
                          gap-1

                          overflow-hidden

                          rounded-[18px]

                          border

                          px-4

                          transition-colors

                          ${
                            active
                              ? "border-white/[0.1] bg-white/[0.06]"
                              : "border-transparent hover:border-white/[0.08] hover:bg-white/[0.04]"
                          }
                        `}
                      >
                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            inset-y-3
                            left-0

                            w-[2px]

                            rounded-full
                          "
                          style={{
                            backgroundColor: game.colour,

                            opacity: active ? 1 : 0.55,
                          }}
                        />

                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="size-2 rounded-full"
                            style={{
                              backgroundColor: game.colour,

                              boxShadow: `0 0 12px ${game.colour}`,
                            }}
                          />

                          <span
                            className="
                              text-sm
                              font-medium
                            "
                            style={
                              active
                                ? {
                                    color: game.colour,
                                  }
                                : undefined
                            }
                          >
                            {game.name}
                          </span>
                        </span>

                        <span className="pl-4 text-xs leading-5 text-white/35">
                          {game.description}
                        </span>
                      </Link>
                    </SheetClose>
                  );
                })}
              </div>
            </div>

            {/* Account */}
            <div
              className="
                border-t
                border-white/[0.08]
                pt-6
              "
            >
              {user ? (
                <SignedInAccount
                  user={user}
                  pathname={pathname}
                  onSignOut={onSignOut}
                />
              ) : (
                <SheetClose asChild>
                  <Link
                    href="/auth"
                    className={`
                      flex
                      min-h-12
                      items-center
                      justify-center

                      rounded-full

                      border
                      border-white/[0.14]

                      px-5

                      text-sm
                      font-medium

                      transition-colors

                      ${
                        pathname === "/auth"
                          ? "bg-white/[0.1] text-white"
                          : "bg-white/[0.05] text-white/80 hover:bg-white/[0.09] hover:text-white"
                      }
                    `}
                  >
                    Sign In
                  </Link>
                </SheetClose>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

type SignedInAccountProps = {
  user: NavigationUser;
  pathname: string;
  onSignOut?: () => void;
};

const SignedInAccount = ({
  user,
  pathname,
  onSignOut,
}: SignedInAccountProps) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Identity */}
      <div
        className="
          flex
          items-center
          gap-3
          rounded-[18px]
          border
          border-white/[0.08]
          bg-white/[0.035]
          px-4
          py-3
        "
      >
        <UserAvatar user={user} />

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>

          <p className="mt-0.5 text-xs text-white/35">Orakl account</p>
        </div>
      </div>

      {/* Account navigation */}
      <div className="flex flex-col gap-1">
        <SheetClose asChild>
          <Link
            href="/games/my-games"
            className={`
              flex
              min-h-12
              items-center
              gap-3
              rounded-2xl
              px-4
              text-sm
              font-medium
              transition-colors

              ${
                pathname.startsWith("/games/my-games")
                  ? "bg-white/[0.07] text-white"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white"
              }
            `}
          >
            <CircleUserRound
              aria-hidden="true"
              className="size-4 text-white/40"
            />
            My Games
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <Link
            href="/profile"
            className={`
              flex
              min-h-12
              items-center
              gap-3
              rounded-2xl
              px-4
              text-sm
              font-medium
              transition-colors

              ${
                pathname.startsWith("/profile")
                  ? "bg-white/[0.07] text-white"
                  : "text-white/60 hover:bg-white/[0.05] hover:text-white"
              }
            `}
          >
            <UserRound aria-hidden="true" className="size-4 text-white/40" />
            Profile
          </Link>
        </SheetClose>

        <SheetClose asChild>
          <button
            type="button"
            onClick={() => {
              onSignOut?.();
            }}
            className="
              flex
              min-h-12
              w-full
              items-center
              gap-3
              rounded-2xl
              px-4
              text-left
              text-sm
              font-medium
              text-white/45
              transition-colors
              hover:bg-white/[0.05]
              hover:text-white/80
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white/20
            "
          >
            <LogOut aria-hidden="true" className="size-4 text-white/35" />
            Sign Out
          </button>
        </SheetClose>
      </div>
    </div>
  );
};

type UserAvatarProps = {
  user: NavigationUser;
};

const UserAvatar = ({ user }: UserAvatarProps) => {
  if (user.image) {
    return (
      <span
        aria-hidden="true"
        className="
          relative
          size-10
          shrink-0
          overflow-hidden
          rounded-full
          border
          border-white/[0.14]
          bg-white/[0.06]
        "
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.image} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="
        flex
        size-10
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-white/[0.14]
        bg-white/[0.07]
        text-xs
        font-semibold
        uppercase
        tracking-[0.04em]
        text-white/75
      "
    >
      {getInitials(user.name)}
    </span>
  );
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "O";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2);
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`;
}
