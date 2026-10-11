import type { ReactNode } from "react";

type NodeEntranceProps = {
  children: ReactNode;
  label: string;
};

export const NodeEntrance = ({ children }: NodeEntranceProps) => {
  return <div className="relative min-h-screen bg-[#050507]">{children}</div>;
};
