/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class BearerJwtStrategy extends PassportStrategy(
  Strategy,
  'bearer-jwt',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.BETTER_AUTH_SECRET!,
    });
  }

  validate(payload: any) {
    // payload should include user id / email depending on Better Auth token format
    return payload;
  }
}
