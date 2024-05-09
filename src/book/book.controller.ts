import { Controller, Get, Param, Post, Body, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { BookService } from './book.service'
import { Book } from './book.entity'
import { BookDto } from './book.dto'

@Controller('book')
export class BookController {
    constructor(private bookService : BookService){}

     /**
     * 
     * /biblioteca/book:
     * get:
     *      summary: Get all books registered in database
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: get all books 
     *          404:
     *              description: books were not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get()
    async findAll(){
        try{
            return await this.bookService.findAll();
        }catch(ex){
            throw new HttpException(`Error while fetching all books: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }        
    }

    /**
     * 
     * /biblioteca/book/{id}:
     * get:
     *      summary: Get a specific book registered in database by id
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: get book found by id
     *          404:
     *              description: book was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get(':bookId')
    async findBook(@Param('bookId') bookId: number):Promise<Book>{
        try{
            return await this.bookService.findBook(bookId)
        }catch(ex){
            throw new HttpException(`Error while fetching the book: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

     /**
     * 
     * /biblioteca/book:
     * post:
     *      summary: Create a new book in database
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: book was created in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Post()
    async createBook(@Body() newBook: BookDto){
        try{
            return await this.bookService.createBook(newBook);
        }catch(ex){
            throw new HttpException(`Error while inserting book: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

    /**
     * 
     * /biblioteca/book/{id}:
     * delete:
     *      summary: Delete a specific book in database by id
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: book with specified id was deleted from database
     *          404:
     *              description: book was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Delete(':bookId') 
    async deleteBook(@Param('bookId') bookId: number) { 
        try{
            return await this.bookService.deleteBook(bookId);   
        }catch(ex){
            throw new HttpException(`Error while deleting book: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

    /**
     * 
     * /biblioteca/book/{id}:
     * put:
     *      summary: Update information from a specific book in database by id
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: book with specified id was updated in database
     *          404:
     *              description: book was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Put(':bookId') 
    async updateBook(@Param('bookId') bookId: number, @Body() body) { 
        try{
            let newBook: any = body;
            return await this.bookService.updateBook(bookId, newBook); 
        }catch(ex){
            throw new HttpException(`Error while updating book: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }          
    }

}
