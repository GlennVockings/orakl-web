import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateTeamsDto } from './dto/create-team.dto';
import { WsGateway } from 'src/ws/ws.gateway';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private wsGateway: WsGateway,
  ) {}

  async createTeams(gameId: string, dto: CreateTeamsDto) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true },
    });

    if (!game) {
      throw new BadRequestException('Game does not exist');
    }

    const names = dto.names
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (names.length === 0) {
      throw new BadRequestException('At least one valid team name is required');
    }

    // Check for duplicates in request itself
    const uniqueNames = new Set(names.map((name) => name.toLowerCase()));
    if (uniqueNames.size !== names.length) {
      throw new BadRequestException('Duplicate team names in request');
    }

    try {
      await this.prisma.team.createMany({
        data: names.map((name) => ({
          gameId,
          name,
        })),
        skipDuplicates: true,
      });
    } catch {
      throw new BadRequestException('Failed to create teams');
    }

    this.wsGateway.emitTeamCreated(gameId, {
      createdCount: names.length,
      names,
    });

    return this.prisma.team.findMany({
      where: { gameId },
      orderBy: { name: 'asc' },
    });
  }

  async getTeams(gameId: string) {
    const game = await this.prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true, members: true },
    });

    if (!game) {
      throw new BadRequestException('Game does not exist');
    }

    return this.prisma.team.findMany({
      where: { gameId },
      orderBy: { name: 'asc' },
    });
  }
}
