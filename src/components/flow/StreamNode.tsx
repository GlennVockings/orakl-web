type StreamNodeProps = {
  className?: string;
};

export function StreamNode({ className = "" }: StreamNodeProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        "relative flex size-8 items-center justify-center",
        "text-primary",
        className,
      ].join(" ")}
    >
      {/* Large halo */}
      <div
        className="
          absolute
          size-8
          scale-75
          rounded-full
          bg-current
          opacity-[0.08]
          transition-[opacity,transform]
          duration-300
          group-data-[active=true]/station:scale-125
          group-data-[active=true]/station:opacity-20
        "
      />

      {/* Inner halo */}
      <div
        className="
          absolute
          size-4
          scale-90
          rounded-full
          bg-current
          opacity-15
          transition-[opacity,transform]
          duration-300
          group-data-[active=true]/station:scale-125
          group-data-[active=true]/station:opacity-40
        "
      />

      {/* Main node */}
      <div
        className="
          relative
          size-2.5
          rounded-full
          bg-current
          transition-[filter,transform]
          duration-300
          group-data-[active=true]/station:scale-125
          group-data-[active=true]/station:drop-shadow-[0_0_8px_currentColor]
        "
      />

      {/* Centre */}
      <div
        className="
          absolute
          size-1
          rounded-full
          bg-background
          transition-transform
          duration-300
          group-data-[active=true]/station:scale-75
        "
      />
    </div>
  );
}
