import { Module } from '@nestjs/common';
import { MarketsService } from './markets.service';
import { MarketsController } from './markets.controller';
import { PrismaService } from 'src/prisma.service';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [GamesModule],
  controllers: [MarketsController],
  providers: [MarketsService, PrismaService],
  exports: [MarketsService],
})
export class MarketsModule {}
