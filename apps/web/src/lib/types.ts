export enum MarketStatus {
	OPEN = "OPEN",
	CLOSED = "CLOSED",
	SETTLED = "SETTLED"
}

export enum SelectionStatus {
	ACTIVE = "ACTIVE",
	WINNER = "WINNER",
	LOSER = "LOSER"
}

enum BetStatus {
	PENDING = "PENDING",
	WON = "WON",
	LOST = "LOST",
	VOID = "VOID"
}

export interface Game {
	id: string;
	name: string;
	status: string;
	joinCode: string;
	startingChips: number;
	createdAt: string;
}

export interface Membership {
	gameId: string;
	id: string;
	joinedAt: string;
	lastSeenAt: string;
	role: string;
	userId: string;
}

export interface LeaderboardEntry {
	userId: string;
	rank: number;
	displayName: string;
	currentBalance: number;
	settledBalance: number;
	rankDelta?: number;
}

export interface Team {
	id: string;
	name: string;
	emoji?: string;
	color?: string;
}

export interface Market {
	id: string;
	name: string;
	status: MarketStatus;
	selections: Selection[]
}

export interface Selection {
	id: string;
	team?: Team;
	label?: string;
	decimalOdds: number;
	status: SelectionStatus;
}

export interface Bet {
	id: string;
	stake: number;
	potenitalReturn: number;
	status: BetStatus;
	placedAt: string;
}

export interface GameLeaderboardRow {
  userId: string;
  displayName: string;
  balance: number;
}

export interface GameSummary {
  id: string;
  name: string;
  status: "DRAFT" | "OPEN" | "CLOSED";
  joinCode: string;
  startingChips: number;
  lastActivityAt: string;
  myMembership: {
    role: "HOST" | "ADMIN" | "PLAYER";
    lastSeenAt: string;
    balance: number;
    hasUpdates: boolean;
  };
  leaderboard: GameLeaderboardRow[];
}