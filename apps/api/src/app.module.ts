import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { GamesModule } from './games/games.module';

@Module({
  imports: [AuthModule, GamesModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
