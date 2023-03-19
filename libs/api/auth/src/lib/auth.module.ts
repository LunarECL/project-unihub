import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ManagementService } from './management.service';
import { User } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { EmailService } from '../../../email/src/lib/email.service';
import { EmailModule } from '@unihub/api/email';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, ManagementService],
  exports: [
    PassportModule,
    ManagementService,
    TypeOrmModule.forFeature([User]),
  ],
})
export class AuthModule {}
