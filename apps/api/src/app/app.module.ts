import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from '@unihub/api/auth';
import { SharedocModule } from '@unihub/api/sharedoc';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '@unihub/api/email';
import { User } from '@unihub/api/auth';
import { Courses } from '@unihub/api/courses';
import { Lecture } from '@unihub/api/courses';
import { Section } from '@unihub/api/courses';
import { CoursesModule } from '@unihub/api/courses';
import { ShareDoc } from '@unihub/api/sharedoc';
import { ScheduleModule } from '@nestjs/schedule';
import { Op } from '@unihub/api/sharedoc';
import { Attribute } from '@unihub/api/sharedoc';

@Module({
  imports: [
    AuthModule,
    SharedocModule,
    CoursesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        AUTH0_DOMAIN: Joi.string().required(),
        AUTH0_CLIENT_ID: Joi.string().required(),
        AUTH0_MANAGEMENT_CLIENT_ID: Joi.string().required(),
        AUTH0_MANAGEMENT_CLIENT_SECRET: Joi.string().required(),
        AUTH0_ISSUER_URL: Joi.string().required(),
        AUTH0_AUDIENCE: Joi.string().required(),

        EMAIL_SERVER: Joi.string().required(),
        EMAIL_USERNAME: Joi.string().required(),
        EMAIL_PASSWORD: Joi.string().required(),

        REDIS_URL: Joi.string().required(),
      }),
      // TODO: modify later to module to block the empty value
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: true,
    //   useGlobalPrefix: true,
    //   cors: {
    //     origin: 'http://localhost:4200',
    //     credentials: true,
    //   },
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Courses, Lecture, Section, ShareDoc, Op, Attribute],
      synchronize: true,
      logging: false,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ envFilePath: `.env` })],
      useFactory: async (configService: ConfigService) => ({
        url: configService.get<string>('REDIS_URL'),
      }),
      inject: [ConfigService],
    }),
    EmailModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
