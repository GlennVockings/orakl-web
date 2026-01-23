import { Body, Controller, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('events')
export class EventsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createEvent(
    @Body() b: { name: string; startsAt?: string; creatorEmail: string },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { email: b.creatorEmail },
      });
      const event = await tx.event.create({
        data: {
          name: b.name,
          startsAt: b.startsAt
            ? new Date(b.startsAt)
            : new Date(Date.now() + 86400000),
          status: 'OPEN',
          createdById: user.id,
          isPublic: true,
        },
      });
      await tx.eventMember.create({
        data: { eventId: event.id, userId: user.id, role: 'HOST' },
      });
      await tx.eventWalletTxn.create({
        data: {
          eventId: event.id,
          userId: user.id,
          type: 'CREDIT',
          amount: 1000,
        },
      });
      return event;
    });
  }

  @Post('/events/:eventId/join')
  async join(@Param('eventId') eventId: string, @Body() b: { email: string }) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { email: b.email },
      });
      await tx.eventMember.upsert({
        where: { eventId_userId: { eventId, userId: user.id } },
        update: {},
        create: { eventId, userId: user.id, role: 'PARTICIPANT' },
      });
      // give chips only once if they have no prior rows in this event
      const hasAny = await tx.eventWalletTxn.findFirst({
        where: { eventId, userId: user.id },
      });
      if (!hasAny) {
        await tx.eventWalletTxn.create({
          data: { eventId, userId: user.id, type: 'CREDIT', amount: 1000 },
        });
      }
      return { ok: true };
    });
  }

  @Post('/events/:eventId/markets')
  async createMarket(
    @Param('eventId') eventId: string,
    @Body()
    b: {
      name: string;
      selections: { label: string; decimalOdds: number }[];
      adminEmail: string;
    },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const admin = await tx.user.findUniqueOrThrow({
        where: { email: b.adminEmail },
      });
      const membership = await tx.eventMember.findFirst({
        where: { eventId, userId: admin.id },
      });
      if (
        !membership ||
        (membership.role !== 'HOST' && membership.role !== 'ADMIN')
      ) {
        throw new Error('Not allowed');
      }
      const market = await tx.market.create({
        data: { eventId, name: b.name, status: 'OPEN' },
      });
      await tx.selection.createMany({
        data: b.selections.map((s) => ({
          marketId: market.id,
          label: s.label,
          decimalOdds: s.decimalOdds,
        })),
      });
      return market;
    });
  }
}
