/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { BearerAuthGuard } from '../auth/bearer.guard';
import { getUserIdFromJwtPayload } from '../auth/auth-user';

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  @UseGuards(BearerAuthGuard)
  @Post()
  async create(@Req() req: any, @Body() body: CreateGameDto) {
    const userId = getUserIdFromJwtPayload(req.user);
    return this.games.createGame(userId, body);
  }
}
