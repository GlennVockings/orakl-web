import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { WsGateway } from '../ws/ws.gateway';

@Controller('bets')
export class BetsController {
  constructor(
    private prisma: PrismaService,
    private ws: WsGateway,
  ) {}

  @Post()
  async place(
    @Body() dto: { userEmail: string; selectionId: string; stake: number },
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({
        where: { email: dto.userEmail },
      });
      const selection = await tx.selection.findUnique({
        where: { id: dto.selectionId },
        include: { market: true },
      });
      if (!selection) throw new Error('Selection not found');
      const market = await tx.market.findUniqueOrThrow({
        where: { id: selection.marketId },
      });
      if (market.status !== 'OPEN') throw new Error('Market not open');

      const eventId = market.eventId;

      // must be a member to bet
      await tx.eventMember.findFirstOrThrow({
        where: { eventId, userId: user.id },
      });

      // check event balance
      const agg = await tx.eventWalletTxn.aggregate({
        where: { eventId, userId: user.id },
        _sum: { amount: true },
      });
      const balance = Number(agg._sum.amount ?? 0);
      if (balance < dto.stake) throw new Error('Insufficient event funds');

      const { Decimal } = await import('@prisma/client/runtime/library');
      const stakeDec = new Decimal(dto.stake);
      const odds = selection.decimalOdds;
      const potential = stakeDec.mul(odds);

      const bet = await tx.bet.create({
        data: {
          eventId,
          userId: user.id,
          selectionId: selection.id,
          stake: stakeDec,
          potentialReturn: potential,
          oddsSnapshot: odds,
        },
      });

      await tx.eventWalletTxn.create({
        data: {
          eventId,
          userId: user.id,
          type: 'DEBIT',
          amount: stakeDec,
          betId: bet.id,
        },
      });

      return { bet, marketId: market.id };
    });

    this.ws.emitTo(`market:${result.marketId}`, 'bet:created', result.bet);
    return result.bet;
  }
}
