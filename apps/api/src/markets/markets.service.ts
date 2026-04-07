import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateMarketDto } from './dto/create-market.dto';
import { Prisma } from '@prisma/client';
import { WsGateway } from 'src/ws/ws.gateway';

@Injectable()
export class MarketsService {
  constructor(
    private prisma: PrismaService,
    private wsGateway: WsGateway,
  ) {}

  async createMarket(gameId: string, dto: CreateMarketDto) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true },
    });

    if (!game) {
      throw new BadRequestException('Game does not exist');
    }

    const hasTeamSelections =
      dto.teamSelections && dto.teamSelections.length > 0;
    const hasLabelSelections =
      dto.labelSelections && dto.labelSelections.length > 0;

    if (!hasTeamSelections && !hasLabelSelections) {
      throw new BadRequestException(
        'A market must have either teamSelections or labelSelections',
      );
    }

    if (hasTeamSelections && hasLabelSelections) {
      throw new BadRequestException(
        'A market cannot have both teamSelections and labelSelections',
      );
    }

    const now = new Date();

    return this.prisma.$transaction(async (tx) => {
      // If using teams, validate team ids belong to this game
      if (hasTeamSelections) {
        const teamIds = dto.teamSelections!.map((s) => s.teamId);

        const teams = await tx.team.findMany({
          where: {
            id: { in: teamIds },
            gameId,
          },
          select: { id: true },
        });

        if (teams.length !== teamIds.length) {
          throw new BadRequestException(
            'One or more teamIds are invalid for this game',
          );
        }

        const uniqueTeamIds = new Set(teamIds);
        if (uniqueTeamIds.size !== teamIds.length) {
          throw new BadRequestException(
            'Duplicate teamIds are not allowed in a market',
          );
        }
      }

      if (hasLabelSelections) {
        const labels = dto.labelSelections!.map((s) => s.label.trim());

        const uniqueLabels = new Set(labels.map((l) => l.toLowerCase()));
        if (uniqueLabels.size !== labels.length) {
          throw new BadRequestException(
            'Duplicate labels are not allowed in a market',
          );
        }
      }

      const market = await tx.market.create({
        data: {
          gameId,
          name: dto.name,
          status: 'OPEN',
          selections: hasTeamSelections
            ? {
                create: dto.teamSelections!.map((selection) => ({
                  teamId: selection.teamId,
                  decimalOdds: new Prisma.Decimal(selection.decimalOdds ?? 2.0),
                })),
              }
            : {
                create: dto.labelSelections!.map((selection) => ({
                  label: selection.label.trim(),
                  decimalOdds: new Prisma.Decimal(selection.decimalOdds ?? 2.0),
                })),
              },
        },
        include: {
          selections: {
            include: {
              team: true,
            },
          },
        },
      });

      await tx.game.update({
        where: { id: gameId },
        data: {
          lastActivityAt: now,
        },
      });

      this.wsGateway.emitMarketCreated(gameId, {
        name: market.name,
      });

      return market;
    });
  }

  async getMarkets(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true },
    });

    if (!game) {
      throw new BadRequestException('Game does not exist');
    }

    return this.prisma.market.findMany({
      where: { gameId },
      orderBy: { createdAt: 'asc' },
      include: {
        selections: {
          include: {
            team: true,
          },
        },
      },
    });
  }
}
