import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { HttpService } from '@nestjs/axios';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), HttpService],
  controllers: [],
  providers: [JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
