import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity'
import { BookService } from './book.service';
import { BookController } from './book.controller';

import { Author } from '../author/author.entity'
import { AuthorService } from '../author/author.service';
import { AuthorController } from '../author/author.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Book, Author])],
    controllers: [BookController, AuthorController],
    providers: [BookService, AuthorService]
})
export class BookModule {}