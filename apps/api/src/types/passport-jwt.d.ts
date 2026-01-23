declare module 'passport-jwt' {
  import { Strategy as PassportStrategy } from 'passport-strategy';
  import { Request } from 'express';

  export interface JwtFromRequestFunction {
    (req: Request): string | null;
  }

  export interface StrategyOptions {
    secretOrKey: string;
    jwtFromRequest: JwtFromRequestFunction;
    ignoreExpiration?: boolean;
    passReqToCallback?: boolean;
    algorithms?: string[];
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      verify: (payload: any, done: (error: any, user?: any) => void) => void,
    );
  }

  export const ExtractJwt: {
    fromAuthHeaderAsBearerToken(): JwtFromRequestFunction;
    fromExtractors(
      extractors: JwtFromRequestFunction[],
    ): JwtFromRequestFunction;
  };
}
