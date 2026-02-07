import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MarketsModule } from './markets/markets.module';
import { EventsModule } from './events/events.module';
import { BetsModule } from './bets/bets.module';
import { WsModule } from './ws/ws.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [EventsModule, MarketsModule, BetsModule, WsModule, AuthModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
