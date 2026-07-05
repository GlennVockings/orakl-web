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

export interface User {
	id: string;
	displayName: string;
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
	previousRank?: number;
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
	potentialReturn: number;
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

export interface GameMe {
  userId: string;
  role: "HOST" | "ADMIN" | "PLAYER";
  isAdmin: boolean;
  currentBalance: number;
  settledBalance: number;
  lastSeenAt: string;
  hasUpdates: boolean;
}

export interface PlaceBet {
	gameId: string;
	marketId: string;
	selectionId: string;
	stake: number;
}

export interface BetList extends Bet {
	market: Market;
	selection: Selection;
	winningSelection: Selection;
	isSettled: boolean;
	user?: User;
}