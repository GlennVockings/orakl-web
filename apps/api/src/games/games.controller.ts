/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { BetterAuthJwtGuard } from '../auth/better-auth-jwt.guard';
import { getUserIdFromJwtPayload } from '../auth/auth-user';

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  @UseGuards(BetterAuthJwtGuard)
  @Post()
  async create(@Req() req: any, @Body() body: CreateGameDto) {
    const userId = getUserIdFromJwtPayload(req.user);
    return this.games.createGame(userId, body);
  }

  @UseGuards(BetterAuthJwtGuard)
  @Get()
  async getAll(@Req() req: any) {
    const userId = getUserIdFromJwtPayload(req.user);
    return this.games.getAll(userId);
  }
}
