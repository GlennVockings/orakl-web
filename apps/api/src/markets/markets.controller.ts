import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Controller('markets')
export class MarketsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    return this.prisma.event.findMany({
      where: { status: { in: ['OPEN', 'SUSPENDED', 'CLOSED'] } },
      include: { markets: { include: { selections: true } } },
    });
  }
}
