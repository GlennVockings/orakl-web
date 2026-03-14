/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { BetterAuthJwtGuard } from '../auth/better-auth-jwt.guard';
import { getUserIdFromJwtPayload } from '../auth/auth-user';
import { JoinGameDto } from './dto/join-game.dto';

@Controller('games')
export class GamesController {
  constructor(private games: GamesService) {}

  @UseGuards(BetterAuthJwtGuard)
  @Post('/create')
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

  @UseGuards(BetterAuthJwtGuard)
  @Post('/join')
  async joinGame(@Req() req: any, @Body() body: JoinGameDto) {
    const userId = getUserIdFromJwtPayload(req.user);
    return this.games.joinGame(userId, body);
  }

  @UseGuards(BetterAuthJwtGuard)
  @Patch(':gameId/seen')
  async markSeen(@Req() req: any, @Param('gameId') gameId: string) {
    const userId = getUserIdFromJwtPayload(req.user);
    return this.games.markSeen(userId, gameId);
  }
}
