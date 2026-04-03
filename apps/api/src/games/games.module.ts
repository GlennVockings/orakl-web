import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { PrismaService } from '../prisma.service';
import { GameAccessService } from './game-access.service';

@Module({
  controllers: [GamesController],
  providers: [GamesService, PrismaService, GameAccessService],
  exports: [GameAccessService],
})
export class GamesModule {}
