import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { ReservationModule } from './reservation/reservation.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

/**
   * Main module of nestjs
   *
   *@remarks
   * Configure connection options for TypeORM and connection to MYSQL database. Details are stored in env file and are obtained with configService layer class.
   * Configure options to use rate limiting
   * Import all modules used in API. (personalized modules)
   * 
*/
@Module({
  imports: [ 
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 25,
    }]),
    TypeOrmModule.forRoot(
    configService.getTypeOrmConfig()
    ),
    ConfigModule.forRoot(), 
    ReservationModule, UserModule, BookModule, AuthorModule, AuthModule ],
  controllers: [],
  providers: [
    {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
    }
  ],
})
export class AppModule {}
