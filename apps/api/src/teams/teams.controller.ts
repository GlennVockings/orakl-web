import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { BetterAuthJwtGuard } from '../auth/better-auth-jwt.guard';
import TeamsService from './teams.service';

@Controller('games/:gameId/teams')
export class TeamsController {
  constructor(private teams: TeamsService) {}

  @UseGuards(BetterAuthJwtGuard)
  @Post()
  async createTeams(@Req() req: any, @Param('gameId') gameId: string) {
    return this.teams.createTeams(gameId);
  }

  @UseGuards(BetterAuthJwtGuard)
  @Get()
  async getTeams(@Req() req: any, @Param('gameId') gameId: string) {
    return this.teams.getTeams(gameId);
  }
}
