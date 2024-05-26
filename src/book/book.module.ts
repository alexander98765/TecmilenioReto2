import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entity/book.entity'
import { BookService } from './book.service';
import { BookController } from './book.controller';

import { Author } from '../author/entity/author.entity'
import { AuthorService } from '../author/author.service';
import { AuthorController } from '../author/author.controller';

/**
   * Module for books. This module is imported into main app module.
   *
   *@remarks
   * Configure Book, and Author entity to work with DB relations.
   * Import all books dependencies, controllers and services. (personalized modules)
   * 
*/
@Module({
    imports: [TypeOrmModule.forFeature([Book, Author])],
    controllers: [BookController, AuthorController],
    providers: [BookService, AuthorService]
})
export class BookModule {}