"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, CircleUserRound, LogOut, UserRound } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavigationUser = {
  name: string;
  image?: string | null;
};

type OraklNavProps = {
  className?: string;
  user?: NavigationUser | null;
  onSignOut?: () => void;
};

const games = [
  {
    name: "Faux Stakes",
    href: "/games/faux-stakes",
    colour: "#F05A28",
    description: "Turn any event into a competition.",
  },
  {
    name: "Predictor",
    href: "/games/predictor",
    colour: "#0057FF",
    description: "Call real sport before it happens.",
  },
  {
    name: "Arena",
    href: "/games/arena",
    colour: "#8B5CF6",
    description: "Study the field. Pick your champion.",
  },
];

export const OraklNav = ({
  className = "",
  user = null,
  onSignOut,
}: OraklNavProps) => {
  const pathname = usePathname();

  const activeGame = games.find((game) => pathname.startsWith(game.href));

  return (
    <nav
      aria-label="Main navigation"
      className={`
        hidden
        items-center
        rounded-[22px]
        border
        border-white/[0.14]
        bg-white/[0.025]
        px-4
        py-3
        shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        backdrop-blur-[10px]
        backdrop-saturate-[1.08]
        md:flex
        ${className}
      `}
    >
      {/* Brand */}
      <Link
        href="/"
        className="
          flex
          min-h-10
          items-center
          gap-3
          rounded-xl
          px-3
          text-white
          transition-colors
          hover:bg-white/[0.05]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-white/20
        "
      >
        <span
          aria-hidden="true"
          className="
            flex
            size-7
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

        <span className="text-sm font-semibold uppercase tracking-[0.18em]">
          Orakl
        </span>
      </Link>

      <div aria-hidden="true" className="mx-5 h-6 w-px bg-white/[0.1]" />

      {/* Games */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="
            flex
            min-h-10
            items-center
            gap-2.5
            rounded-xl
            px-4
            text-sm
            font-medium
            text-white/60
            outline-none
            transition-colors
            hover:bg-white/[0.05]
            hover:text-white
            focus-visible:ring-2
            focus-visible:ring-white/20
            data-[state=open]:bg-white/[0.06]
            data-[state=open]:text-white
          "
        >
          {activeGame ? (
            <>
              <span
                aria-hidden="true"
                className="size-2 rounded-full"
                style={{
                  backgroundColor: activeGame.colour,
                  boxShadow: `0 0 12px ${activeGame.colour}`,
                }}
              />

              <span
                style={{
                  color: activeGame.colour,
                }}
              >
                {activeGame.name}
              </span>
            </>
          ) : (
            <span>Games</span>
          )}

          <ChevronDown
            aria-hidden="true"
            className="
              size-3.5
              text-white/40
              transition-transform
              duration-300
              [[data-state=open]_&]:rotate-180
            "
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={14}
          className="
            z-[100]
            w-[340px]
            rounded-[24px]
            border-white/[0.14]
            bg-black/55
            p-2
            text-white
            shadow-[0_28px_90px_rgba(0,0,0,0.55)]
            backdrop-blur-[18px]
            backdrop-saturate-[1.1]
          "
        >
          {games.map((game) => {
            const active = pathname.startsWith(game.href);

            return (
              <DropdownMenuItem
                key={game.name}
                asChild
                className="
                  group
                  cursor-pointer
                  rounded-[18px]
                  p-0
                  focus:bg-white/[0.045]
                  focus:text-white
                "
              >
                <Link
                  href={game.href}
                  aria-current={active ? "page" : undefined}
                  className={`
                    relative
                    flex
                    w-full
                    flex-col
                    items-start
                    gap-1
                    overflow-hidden
                    rounded-[18px]
                    px-4
                    py-3.5
                    ${active ? "bg-white/[0.04]" : ""}
                  `}
                >
                  <span
                    aria-hidden="true"
                    className={`
                      absolute
                      inset-y-3
                      left-0
                      w-[2px]
                      rounded-full
                      transition-opacity
                      ${
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus:opacity-100"
                      }
                    `}
                    style={{
                      backgroundColor: game.colour,
                    }}
                  />

                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="size-2 rounded-full opacity-70"
                      style={{
                        backgroundColor: game.colour,
                        boxShadow: `0 0 12px ${game.colour}`,
                      }}
                    />

                    <span
                      className="text-sm font-medium text-white/80"
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
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div aria-hidden="true" className="mx-5 h-6 w-px bg-white/[0.1]" />

      {/* Account */}
      {user ? (
        <UserMenu user={user} pathname={pathname} onSignOut={onSignOut} />
      ) : (
        <Link
          href="/auth"
          className={`
            flex
            min-h-10
            items-center
            rounded-xl
            border
            border-white/[0.12]
            px-5
            text-sm
            font-medium
            transition-colors
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-white/20
            ${
              pathname === "/auth"
                ? "bg-white/[0.1] text-white"
                : "bg-white/[0.05] text-white/85 hover:bg-white/[0.09] hover:text-white"
            }
          `}
        >
          Sign In
        </Link>
      )}
    </nav>
  );
};

type UserMenuProps = {
  user: NavigationUser;
  pathname: string;
  onSignOut?: () => void;
};

const UserMenu = ({ user, pathname, onSignOut }: UserMenuProps) => {
  const accountActive =
    pathname.startsWith("/games/my-games") || pathname.startsWith("/profile");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`
          flex
          min-h-10
          items-center
          gap-2.5
          rounded-xl
          border
          border-white/[0.12]
          px-3
          pr-3.5
          text-sm
          font-medium
          outline-none
          transition-colors
          focus-visible:ring-2
          focus-visible:ring-white/20
          data-[state=open]:bg-white/[0.1]
          data-[state=open]:text-white
          ${
            accountActive
              ? "bg-white/[0.09] text-white"
              : "bg-white/[0.05] text-white/85 hover:bg-white/[0.09] hover:text-white"
          }
        `}
      >
        <UserAvatar user={user} />

        <span className="max-w-32 truncate">{getFirstName(user.name)}</span>

        <ChevronDown
          aria-hidden="true"
          className="
            size-3.5
            text-white/40
            transition-transform
            duration-300
            [[data-state=open]_&]:rotate-180
          "
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={14}
        className="
          z-[100]
          w-[260px]
          rounded-[22px]
          border-white/[0.14]
          bg-black/55
          p-2
          text-white
          shadow-[0_28px_90px_rgba(0,0,0,0.55)]
          backdrop-blur-[18px]
          backdrop-saturate-[1.1]
        "
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <UserAvatar user={user} size="large" />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user.name}
            </p>

            <p className="mt-0.5 text-xs text-white/35">Orakl account</p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1 bg-white/[0.08]" />

        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-[14px]
            p-0
            focus:bg-white/[0.06]
            focus:text-white
          "
        >
          <Link
            href="/games/my-games"
            className="flex min-h-11 items-center gap-3 px-3 text-sm text-white/70"
          >
            <CircleUserRound
              aria-hidden="true"
              className="size-4 text-white/40"
            />
            My Games
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          asChild
          className="
            cursor-pointer
            rounded-[14px]
            p-0
            focus:bg-white/[0.06]
            focus:text-white
          "
        >
          <Link
            href="/profile"
            className="flex min-h-11 items-center gap-3 px-3 text-sm text-white/70"
          >
            <UserRound aria-hidden="true" className="size-4 text-white/40" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-white/[0.08]" />

        <DropdownMenuItem
          className="
            min-h-11
            cursor-pointer
            gap-3
            rounded-[14px]
            px-3
            text-sm
            text-white/50
            focus:bg-white/[0.06]
            focus:text-white
          "
          onSelect={() => {
            onSignOut?.();
          }}
        >
          <LogOut aria-hidden="true" className="size-4 text-white/35" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type UserAvatarProps = {
  user: NavigationUser;
  size?: "small" | "large";
};

const UserAvatar = ({ user, size = "small" }: UserAvatarProps) => {
  const sizeClass = size === "large" ? "size-9 text-xs" : "size-7 text-[10px]";

  if (user.image) {
    return (
      <span
        aria-hidden="true"
        className={`
          relative
          shrink-0
          overflow-hidden
          rounded-full
          border
          border-white/[0.14]
          bg-white/[0.06]
          ${sizeClass}
        `}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.image} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`
        flex
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-white/[0.14]
        bg-white/[0.07]
        font-semibold
        uppercase
        tracking-[0.04em]
        text-white/75
        ${sizeClass}
      `}
    >
      {getInitials(user.name)}
    </span>
  );
};

function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] || "Account";
}

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
