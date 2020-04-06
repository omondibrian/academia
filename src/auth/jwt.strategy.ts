import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secreatekey',
    });
  }

  async validate({
    payload,
    done,
  }: {
    payload: { id: string; iat: string };
    done: VerifiedCallback;
  }) {
    const user = await this.auth.validateJwtPayload(payload);
    if (!user) {
      return done(
        new HttpException('Unauthorised assess', HttpStatus.UNAUTHORIZED),
        false,
      );
    }
    return done(null, user, payload.iat);
  }
}
