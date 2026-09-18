type GameCardBannerProps = {
  text: string;
  className?: string;
};

export function GameCardBanner({ text, className = "" }: GameCardBannerProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
      <div
        className={`
          absolute
          left-1/2
          top-1/2
          w-[145%]
          -translate-x-1/2
          -translate-y-1/2
          rotate-[38deg]
          border-y
          border-white/20
          bg-black/70
          px-4
          py-3
          text-center
          backdrop-blur-md
          ${className}
        `}
      >
        <span className="text-sm font-semibold uppercase tracking-[0.28em] text-white sm:text-base">
          {text}
        </span>
      </div>
    </div>
  );
}
