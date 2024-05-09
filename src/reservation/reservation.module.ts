import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservation.entity'
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

import { Book } from '../book/book.entity'
import { BookService } from '../book//book.service';
import { BookController } from '../book//book.controller';

import { Author } from '../author/author.entity'
import { AuthorService } from '../author/author.service';
import { AuthorController } from '../author/author.controller';

import { User } from '../user/user.entity'
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation, Book, Author, User])],
    controllers: [ReservationController, BookController, AuthorController, UserController],
    providers: [ReservationService, BookService, AuthorService, UserService]
})
export class ReservationModule {}