import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { User } from './users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * @see https://auth0.com/blog/developing-a-secure-api-with-nestjs-adding-authorization/
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_JWKS}`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: process.env.AUTH0_AUDIENCE,
      issuer: `${process.env.AUTH0_ISSUER_URL}`,
      algorithms: ['RS256'],
    });
  }

  /**
   * If not work (Only returning 401 Unauthorized)
   * @see https://stackoverflow.com/questions/75771282/nestjs-authguard-jwt-auth0-constantly-returns-401-unauthorized
   *
   * for getting email from payload
   * @see https://community.auth0.com/t/can-i-add-email-address-to-the-access-token-when-calling-an-api/70163
   */
  async validate(payload: any): Promise<{ email: string; userId: string }> {
    const email = payload['https://example.com/email'];
    const userId = payload['sub'];

    //Check if user already exists
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const newUser = this.userRepository.create({ email, userId });
      this.userRepository.save(newUser);
    } //end if

    return { email, userId };
  }
}
