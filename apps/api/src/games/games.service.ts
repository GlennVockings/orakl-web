/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GamesService {
  constructor(private prisma: PrismaService) {}

  private generateJoinCode(length = 6): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    // Removed: I, O, 0, 1 (to avoid confusion)

    let result = '';
    for (let i = 0; i < length; i++) {
      const rand = Math.floor(Math.random() * chars.length);
      result += chars[rand];
    }

    return result;
  }

  private async generateUniqueJoinCode(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const code = this.generateJoinCode(6);

      const exists = await this.prisma.game.findUnique({
        where: { joinCode: code },
      });

      if (!exists) return code;
    }

    throw new Error('Failed to generate unique join code');
  }

  async createGame(userId: string, dto: CreateGameDto) {
    for (let i = 0; i < 10; i++) {
      const joinCode = this.generateJoinCode(6);

      try {
        const game = await this.prisma.game.create({
          data: {
            name: dto.name,
            joinCode,
            startingChips: dto.startingChips ?? 1000,
            createdById: userId,
            status: 'DRAFT',
            members: {
              create: {
                userId,
                role: 'HOST',
              },
            },
          },
        });

        return game;
      } catch (err: any) {
        // Prisma unique constraint error
        if (err.code === 'P2002') {
          continue; // retry with new code
        }
        throw err;
      }
    }

    throw new Error('Failed to generate unique join code');
  }
}
