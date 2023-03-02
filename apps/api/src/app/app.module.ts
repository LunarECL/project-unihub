import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import Joi from 'joi';
import { User } from '../users/entities/user.entity';

import { UsersModule } from '../users/users.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        //   NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        //   DB_HOST: Joi.string().required(),
        //   DB_PORT: Joi.string().required(),
        //   DB_USERNAME: Joi.string().required(),
        //   DB_PASSWORD: Joi.string().required(),
        //   DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      }),
      // TODO: modify later to module to block the empty value
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
