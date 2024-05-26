import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entity/reservation.entity'
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';

import { Book } from '../book/entity/book.entity'
import { BookService } from '../book//book.service';
import { BookController } from '../book//book.controller';

import { Author } from '../author/entity/author.entity'
import { AuthorService } from '../author/author.service';
import { AuthorController } from '../author/author.controller';

import { User } from '../user/entity/user.entity'
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';

/**
   * Module for reservations. This module is imported into main app module.
   *
   *@remarks
   * Configure Reservation, User, Author and Book entity to work with DB relations.
   * Import all user dependencies, controllers and services. (personalized modules)
   * 
*/
@Module({
    imports: [TypeOrmModule.forFeature([Reservation, Book, Author, User])],
    controllers: [ReservationController, BookController, AuthorController, UserController],
    providers: [ReservationService, BookService, AuthorService, UserService]
})
export class ReservationModule {}