FAKE BETTING APP – BACKEND PLANNING NOTES
========================================

GOAL
----
A private, invite-only “fake betting” app for things like sports days, office games, etc.
No public games. No real money. Everything is scoped to a single game.

----------------------------------------
CORE TERMINOLOGY (LOCK THIS IN)
----------------------------------------

User
- A signed-up account (email + password)

Game
- A private betting session (e.g. “Sports Day 2026”)
- Created by a user
- Joined via a join code only

Host
- The user who created the game
- Full control over setup and settlement

Member
- A user who has joined a game
- Can place bets and view leaderboard

Team
- Competitors in the game (e.g. Red Team, Blue Team)
- Game-level concept (recommended)

Market
- A betting category inside a game
- Example: “Egg & Spoon Race – Winner”

Selection
- The choices within a market
- Usually teams (Team A, Team B)

Bet
- A user’s stake on a selection

Ledger / Wallet Transactions
- Game-scoped wallet transactions
- CREDIT, DEBIT, PAYOUT, REFUND
- Balance = sum of transactions per (user + game)

Leaderboard
- Ranking of members within a game
- Based on event-scoped wallet balance

----------------------------------------
HIGH-LEVEL FLOW
----------------------------------------

1. User signs up / logs in
2. User creates a game
   - Becomes HOST
   - Join code generated
3. Other users join via join code
   - Become MEMBERS
   - Get starting chips (default: 1000)
4. Host/Admin sets up:
   - Teams
   - Markets with selections
5. Members place bets
6. Host/Admin closes & settles markets
7. Ledger updates → leaderboard updates

----------------------------------------
GAME RULES
----------------------------------------

- Games are private (join code only)
- No global wallet
- Chips are scoped per game
- Admin chooses ONE winning selection per market (prototype)
- All balances derived from ledger (never stored directly)

----------------------------------------
DATA MODEL (CONCEPTUAL)
----------------------------------------

Game
- id
- name
- status (DRAFT | OPEN | CLOSED)
- joinCode (unique)
- startingChips (default 1000)
- createdById
- timestamps

GameMember
- id
- gameId
- userId
- role (HOST | ADMIN | PLAYER)
- joinedAt
- unique (gameId + userId)

Team
- id
- gameId
- name
- optional UI data (color / emoji)

Market
- id
- gameId
- name
- status (OPEN | CLOSED | SETTLED)
- unique (gameId + name)
- timestamps

Selection
- id
- marketId
- teamId (preferred) OR label (prototype shortcut)
- decimalOdds
- status (ACTIVE | WINNER | LOSER)

Bet
- id
- gameId (denormalized)
- userId
- marketId
- selectionId
- stake
- oddsSnapshot
- potentialReturn
- status (PENDING | WON | LOST)
- timestamps

GameWalletTxn
- id
- gameId
- userId
- type (CREDIT | DEBIT | PAYOUT | REFUND)
- amount
- betId? / marketId?
- timestamps

----------------------------------------
AUTH (PROTOTYPE + FUTURE-PROOF)
----------------------------------------

- Email + password
- JWT stored in HttpOnly cookie
- Cookie sent automatically on requests
- Backend extracts JWT from cookies
- /auth/me returns user + game memberships

----------------------------------------
CORE API ENDPOINTS
----------------------------------------

AUTH
----
POST   /auth/signup
POST   /auth/login
POST   /auth/logout
GET    /auth/me

GAMES
-----
POST   /games
  - Create game
  - Generate join code
  - Creator becomes HOST

GET    /games
  - List games the current user is a member of

GET    /games/:gameId
  - Game details + markets summary

JOIN (PRIVATE)
--------------
POST   /games/join
  body: { code: "ABCD12" }

POST   /games/:gameId/regenerate-code (HOST only)

MEMBERS
-------
GET    /games/:gameId/members
POST   /games/:gameId/members/:userId/role (HOST)
POST   /games/:gameId/kick/:userId (optional)

TEAMS
-----
POST   /games/:gameId/teams (HOST/ADMIN)
GET    /games/:gameId/teams

MARKETS
-------
POST   /games/:gameId/markets (HOST/ADMIN)
GET    /games/:gameId/markets
GET    /markets/:marketId
POST   /markets/:marketId/close (HOST/ADMIN)
POST   /markets/:marketId/settle (HOST/ADMIN)

BETS
----
POST   /bets
  body: { selectionId, stake }

GET    /games/:gameId/bets/me
GET    /markets/:marketId/bets (HOST/ADMIN)

WALLET / LEADERBOARD
-------------------
GET    /games/:gameId/balance
GET    /games/:gameId/leaderboard

----------------------------------------
REALTIME (WEBSOCKETS)
----------------------------------------

Rooms:
- game:<gameId>
- market:<marketId>

Events:
- bet:created
- market:closed
- market:settled
- leaderboard:updated

----------------------------------------
ACCESS CONTROL RULES
----------------------------------------

- Must be GameMember to:
  - View game
  - Place bets
  - View leaderboard

- Must be HOST or ADMIN to:
  - Create teams
  - Create markets
  - Close / settle markets
  - Regenerate join code

----------------------------------------
RECOMMENDED BUILD ORDER (PROTOTYPE)
----------------------------------------

1. POST /games (create + join code)
2. POST /games/join (join by code)
3. GET /games (my games page)
4. Teams creation
5. Markets creation
6. Place bets
7. Settle markets
8. Leaderboard
9. WebSocket polish

----------------------------------------
JOIN CODE NOTES
----------------------------------------

- 6 characters
- Uppercase
- Exclude confusing chars (0, O, 1, I)
- Unique index
- Regeneratable by HOST

----------------------------------------
KEY DESIGN PRINCIPLES
----------------------------------------

- Event-scoped everything
- Ledger-based balances
- Controllers thin, services thick
- Guards for permissions
- No global state
- Easy to extend later
