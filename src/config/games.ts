export type GameDefinition = {
  id: "predictor" | "faux-stakes";
  name: string;
  href: string;
  colour: string;
  description: string;
  status: "available" | "coming-soon";
};

export const games: GameDefinition[] = [
  {
    id: "predictor",
    name: "Predictor",
    href: "/predictor",
    colour: "#0057FF",
    description:
      "Make your predictions, compete with friends and climb the table.",
    status: "available",
  },
  {
    id: "faux-stakes",
    name: "Faux Stakes",
    href: "/faux-stakes",
    colour: "#FF6B00",
    description:
      "Create markets, back outcomes with virtual chips and earn the bragging rights.",
    status: "available",
  },
];