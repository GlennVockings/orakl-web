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
import { TeamsService } from './teams.service';
import CreateTeamsDto from './dto/create-team.dto';
import { getUserIdFromJwtPayload } from 'src/auth/auth-user';
import GameAccessService from 'src/games/game-access.service';

@Controller('games/:gameId/teams')
export class TeamsController {
  constructor(
    private teams: TeamsService,
    private gameAccess: GameAccessService,
  ) {}

  @UseGuards(BetterAuthJwtGuard)
  @Post()
  async createTeams(
    @Req() req: { user: string },
    @Param('gameId') gameId: string,
    @Body() body: CreateTeamsDto,
  ) {
    const userId = getUserIdFromJwtPayload(req.user);
    await this.gameAccess.requireGameAdmin(userId, gameId);
    return this.teams.createTeams(gameId, body);
  }

  @UseGuards(BetterAuthJwtGuard)
  @Get()
  async getTeams(
    @Req() req: { user: string },
    @Param('gameId') gameId: string,
  ) {
    const userId = getUserIdFromJwtPayload(req.user);
    await this.gameAccess.requireGameMember(userId, gameId);
    return this.teams.getTeams(gameId);
  }
}
