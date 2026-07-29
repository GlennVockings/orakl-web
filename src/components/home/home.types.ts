export type HomeProduct = "platform" | "predictor" | "faux-stakes";

export type ActiveGame = Exclude<HomeProduct, "platform"> | null;