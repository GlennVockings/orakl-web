import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MarketsModule } from './markets/markets.module';
import { EventsModule } from './events/events.module';
import { BetsModule } from './bets/bets.module';
import { WsModule } from './ws/ws.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [EventsModule, MarketsModule, BetsModule, WsModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
