/* eslint-disable */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bcrypt from 'bcrypt';

const hash = (p: string) => bcrypt.hash(p, 10);

async function seed() {
  console.log('🔰 Seeding start');

  // ----- USERS -----
  const [alice, bob, charlie, jenny, alex] = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: { email: 'alice@example.com', displayName: 'Alice', role: 'ADMIN', passwordHash: await hash('password123') }, // Alice hosts
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: { email: 'bob@example.com', displayName: 'Bob', role: 'PLAYER', passwordHash: await hash('password123') },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: { email: 'charlie@example.com', displayName: 'Charlie', role: 'PLAYER', passwordHash: await hash('password123') },
    }),
    prisma.user.upsert({
      where: { email: 'jenny@example.com' },
      update: {},
      create: { email: 'jenny@example.com', displayName: 'Jenny', role: 'PLAYER', passwordHash: await hash('password123') },
    }),
    prisma.user.upsert({
      where: { email: 'alex@example.com' },
      update: {},
      create: { email: 'alex@example.com', displayName: 'Alex', role: 'PLAYER', passwordHash: await hash('password123') },
    }),
  ]);

  // ----- EVENT (Alice hosts) -----
  const existingEvent = await prisma.event.findFirst({ where: { name: 'Sports Day Demo' } });
  const event =
    existingEvent ??
    (await prisma.event.create({
      data: {
        name: 'Sports Day Demo',
        startsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'OPEN',
        createdById: alice.id,
        isPublic: true,
      },
    }));

  // Ensure Alice is HOST member
  await prisma.eventMember.upsert({
    where: { eventId_userId: { eventId: event.id, userId: alice.id } },
    update: { role: 'HOST' },
    create: { eventId: event.id, userId: alice.id, role: 'HOST' },
  });

  // ----- JOINERS (Bob, Charlie, Jenny) -----
  const joiners = [bob, charlie, jenny]; // Alex is purposely left out for testing
  await prisma.eventMember.createMany({
    data: joiners.map((u) => ({ eventId: event.id, userId: u.id, role: 'PARTICIPANT' })),
    skipDuplicates: true,
  });

  // Give 1000 credits to joiners (only if they don’t already have any txns in this event)
  for (const u of joiners) {
    const hasAny = await prisma.eventWalletTxn.findFirst({ where: { eventId: event.id, userId: u.id } });
    if (!hasAny) {
      await prisma.eventWalletTxn.create({
        data: { eventId: event.id, userId: u.id, type: 'CREDIT', amount: 1000 },
      });
    }
  }

  // Also credit Alice (host can play too)
  const hostHasAny = await prisma.eventWalletTxn.findFirst({ where: { eventId: event.id, userId: alice.id } });
  if (!hostHasAny) {
    await prisma.eventWalletTxn.create({
      data: { eventId: event.id, userId: alice.id, type: 'CREDIT', amount: 1000 },
    });
  }

  // ----- MARKETS -----
  // Upsert helper (by (eventId, name)); if you don’t have @@unique([eventId, name]) yet, this still works.
  async function findOrCreateMarket(name: string) {
    const found = await prisma.market.findFirst({ where: { eventId: event.id, name } });
    if (found) return found;
    return prisma.market.create({ data: { eventId: event.id, name, status: 'OPEN' } });
  }

  const egg = await findOrCreateMarket('Egg & Spoon — Winner');
  const three = await findOrCreateMarket('3-Legged Race — Winner');
  const sack = await findOrCreateMarket('Sack Race — Winner');

  // Deterministic selections (clear old on these markets then recreate)
  await prisma.selection.deleteMany({ where: { marketId: { in: [egg.id, three.id, sack.id] } } });

  await prisma.selection.createMany({
    data: [
      // Egg & Spoon
      { marketId: egg.id, label: 'Team A', decimalOdds: 1.80 },
      { marketId: egg.id, label: 'Team B', decimalOdds: 2.10 },
      { marketId: egg.id, label: 'Team C', decimalOdds: 3.20 },
      // 3-Legged
      { marketId: three.id, label: 'Team A', decimalOdds: 2.00 },
      { marketId: three.id, label: 'Team C', decimalOdds: 1.90 },
      // Sack Race
      { marketId: sack.id, label: 'Team B', decimalOdds: 2.40 },
      { marketId: sack.id, label: 'Team C', decimalOdds: 1.75 },
    ],
  });

  // ----- LOG COUNTS -----
  const [userCount, eventCount, marketCount, selectionCount, memberCount, walletRows] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.market.count({ where: { eventId: event.id } }),
    prisma.selection.count({ where: { market: { eventId: event.id } } }),
    prisma.eventMember.count({ where: { eventId: event.id } }),
    prisma.eventWalletTxn.count({ where: { eventId: event.id } }),
  ]);

  console.log('✅ Seed complete', {
    users: userCount, // 5
    events: eventCount,
    marketsInEvent: marketCount, // 3
    selectionsInEvent: selectionCount, // 7
    membersInEvent: memberCount, // 4 (Alice + Bob + Charlie + Jenny)
    eventWalletRows: walletRows, // credits created
    eventId: event.id,
    host: 'alice@example.com',
    joiners: ['bob@example.com', 'charlie@example.com', 'jenny@example.com'],
    leftOutForTesting: 'alex@example.com',
  });
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
