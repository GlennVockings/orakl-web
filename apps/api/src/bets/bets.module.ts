import { Module } from '@nestjs/common';
import { BetsController } from './bets.controller';
import { PrismaService } from '../prisma.service';
import { WsModule } from '../ws/ws.module';

@Module({
  imports: [WsModule],
  controllers: [BetsController],
  providers: [PrismaService],
})
export class BetsModule {}
