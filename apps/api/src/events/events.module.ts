import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [EventsController],
  providers: [PrismaService],
})
export class EventsModule {}
