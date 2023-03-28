import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ManagementService } from './management.service';
import { User } from './users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { EmailService } from '@unihub/api/email';
import { EmailModule } from '@unihub/api/email';
import { CoursesModule, Lecture } from '@unihub/api/courses';
import { CurrentUser } from './current-user.decorator';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    EmailModule,
    forwardRef(() => CoursesModule), // use forwardRef() here
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
