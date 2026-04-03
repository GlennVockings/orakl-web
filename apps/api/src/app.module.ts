import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { GamesModule } from './games/games.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { TeamsModule } from './teams/teams.module';
import { MarketsModule } from './markets/markets.module';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    AuthModule,
    GamesModule,
    LeaderboardModule,
    TeamsModule,
    MarketsModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
