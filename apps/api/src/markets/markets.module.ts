import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { PrismaService } from 'src/prisma.service';
import { GamesModule } from 'src/games/games.module';
import { WsModule } from 'src/ws/ws.module';
import { LeaderboardService } from 'src/leaderboard/leaderboard.service';

@Module({
  imports: [GamesModule, WsModule],
  controllers: [MarketsController],
  providers: [MarketsService, PrismaService, LeaderboardService],
  exports: [MarketsService],
})
export class MarketsModule {}
