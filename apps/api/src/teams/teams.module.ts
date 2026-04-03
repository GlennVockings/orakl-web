import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { GamesModule } from 'src/games/games.module';

@Module({
  imports: [GamesModule],
  controllers: [TeamsController],
  providers: [TeamsService, PrismaService],
  exports: [TeamsService],
})
export class TeamsModule {}
