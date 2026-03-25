import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BetterAuthJwtGuard } from '../auth/better-auth-jwt.guard';
import { getUserIdFromJwtPayload } from '../auth/auth-user';
import { GameAccessService } from '../games/game-access.service';
import { MarketsService } from './markets.service';
import { CreateMarketDto } from './dto/create-market.dto';

@Controller('games/:gameId/markets')
export class MarketsController {
  constructor(
    private markets: MarketsService,
    private gameAccess: GameAccessService,
  ) {}

  @UseGuards(BetterAuthJwtGuard)
  @Post()
  async createMarket(
    @Req() req: { user: string },
    @Param('gameId') gameId: string,
    @Body() body: CreateMarketDto,
  ) {
    const userId = getUserIdFromJwtPayload(req.user);

    await this.gameAccess.requireGameAdmin(userId, gameId);

    return this.markets.createMarket(gameId, body);
  }

  @UseGuards(BetterAuthJwtGuard)
  @Get()
  async getMarkets(
    @Req() req: { user: string },
    @Param('gameId') gameId: string,
  ) {
    const userId = getUserIdFromJwtPayload(req.user);

    await this.gameAccess.requireGameMember(userId, gameId);

    return this.markets.getMarkets(gameId);
  }
}
