export interface Game {
	id: string;
	createdAt: string;
	joinCode: string;
	startingChips: number;
	name: string;
	status: string;
}

export interface Membership {
	gameId: string;
	id: string;
	joinedAt: string;
	lastSeenAt: string;
	role: string;
	userId: string;
}