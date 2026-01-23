import { Module } from '@nestjs/common';
import { MarketsController } from './markets.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MarketsController],
  providers: [PrismaService],
})
export class MarketsModule {}
