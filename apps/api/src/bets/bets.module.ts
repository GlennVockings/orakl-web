import { Module } from '@nestjs/common';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';
import { PrismaService } from 'src/prisma.service';
import GameAccessService from 'src/games/game-access.service';

@Module({
  controllers: [BetsController],
  providers: [BetsService, PrismaService, GameAccessService],
  exports: [BetsService],
})
export class BetsModule {}
