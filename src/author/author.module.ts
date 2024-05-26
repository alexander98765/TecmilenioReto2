import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entity/author.entity'
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

/**
   * Module for authors. This module is imported into main app module.
   *
   *@remarks
   * Configure Author entity to work with DB relations.
   * Import all author dependencies, controllers and services. (personalized modules)
   * 
*/
@Module({
    imports: [TypeOrmModule.forFeature([Author])],
    controllers: [AuthorController],
    providers: [AuthorService]
})
export class AuthorModule {}