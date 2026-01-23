// apps/api/src/users/users.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  /**
   * GET /users
   * Optional: /users?eventId=<id>  -> only memberships/balances/bets for that event
   */
  @Get()
  async list(@Query('eventId') eventId?: string) {
    // 1) Users + their memberships (and event meta)
    const users = await this.prisma.user.findMany({
      include: {
        memberships: {
          where: eventId ? { eventId } : undefined,
          include: {
            event: { select: { id: true, name: true, status: true } },
          },
        },
      },
      orderBy: { displayName: 'asc' },
    });

    // If there are no memberships (e.g. empty DB), early return a simple shape
    const allMemberships = users.flatMap((u) => u.memberships);
    const eventIds = Array.from(new Set(allMemberships.map((m) => m.eventId)));
    const userIds = Array.from(new Set(users.map((u) => u.id)));

    // 2) Balances: group EventWalletTxn by (userId, eventId)
    const balances = eventIds.length
      ? await this.prisma.eventWalletTxn.groupBy({
          by: ['userId', 'eventId'],
          where: { eventId: { in: eventIds }, userId: { in: userIds } },
          _sum: { amount: true },
        })
      : [];

    const balanceMap = new Map<string, number>(); // key: `${userId}:${eventId}`
    for (const row of balances) {
      balanceMap.set(
        `${row.userId}:${row.eventId}`,
        Number(row._sum.amount ?? 0),
      );
    }

    // 3) Bets for those users in those events
    const bets = eventIds.length
      ? await this.prisma.bet.findMany({
          where: { eventId: { in: eventIds }, userId: { in: userIds } },
          select: {
            id: true,
            eventId: true,
            userId: true,
            selectionId: true,
            stake: true,
            potentialReturn: true,
            oddsSnapshot: true,
            status: true,
            placedAt: true,
            settledAt: true,
          },
          orderBy: { placedAt: 'desc' },
        })
      : [];

    const betsMap = new Map<string, any[]>(); // key: `${userId}:${eventId}`
    for (const b of bets) {
      const key = `${b.userId}:${b.eventId}`;
      if (!betsMap.has(key)) betsMap.set(key, []);
      betsMap.get(key)!.push(b);
    }

    // 4) Shape the response
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      events: u.memberships.map((m) => ({
        eventId: m.event.id,
        eventName: m.event.name,
        eventStatus: m.event.status,
        role: m.role,
        balance: balanceMap.get(`${u.id}:${m.eventId}`) ?? 0,
        bets: betsMap.get(`${u.id}:${m.eventId}`) ?? [],
      })),
    }));
  }
}
