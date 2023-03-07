import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { ManagementService } from './management.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), HttpModule],
  controllers: [],
  providers: [JwtStrategy, ManagementService],
  exports: [PassportModule, ManagementService],
})
export class AuthModule {}
