import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from '../config/config.service';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [ TypeOrmModule.forRoot(
    configService.getTypeOrmConfig()
  ), ReservationModule, UserModule, BookModule, AuthorModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
