import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BearerJwtStrategy } from './bearer.strategy';

@Module({
  imports: [PassportModule],
  providers: [BearerJwtStrategy],
  exports: [],
})
export class AuthModule {}
