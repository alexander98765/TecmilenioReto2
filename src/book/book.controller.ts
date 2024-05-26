import { Controller, Get, Param, Post, Body, Delete, Put, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { BookService } from './book.service'
import { Book } from './entity/book.entity'
import { BookDto } from './dto/book.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../user/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * Represents a class to expose Book endpoints
 * 
 * @remarks
 * Endpoints can be found using prefix "book"
 * Endpoints use rate limiting
 * 
 * @public
 */
@SkipThrottle({ default: false })
@Controller('book')
export class BookController {

    /**
    * @param bookService - Insntace of book service to make operations in database.
    * @private
    */
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
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions.
     *          404:
     *              description: Books were not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 200, description: 'Get all books registered in database.'})
     @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
     @ApiResponse({ status: 404, description: 'Books were not found in database.'})
     @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
     @ApiResponse({ status: 429, description: 'Too many request.'})
     @ApiResponse({ status: 500, description: 'Server side error.'})
     @ApiOperation({ summary: 'Get all books registered in database. ONLY users with "Administrador" and "Usuario" roles are able to execute this endpoint' })
     @ApiTags('Book')
     @ApiBearerAuth()
     @HasRoles(Role.Administrador, Role.Usuario)
     @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          401:
     *              description: book was not found in database
     *          404:
     *              description: book was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific book registered in database by id.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Book was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific book registered in database by id. ONLY users with "Administrador" and "Usuario" roles are able to execute this endpoint' })
    @ApiTags('Book')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador, Role.Usuario)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     * /biblioteca/book/bookName/{bookName}:
     * get:
     *      summary: Get a specific book registered in database by book name
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: get book found by book name
     *          401:
     *              description: book was not found in database
     *          404:
     *              description: book was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific book registered in database by book name.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Book was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific book registered in database by book name. Endpoint applies a LIKE caluse on the search. ONLY users with "Administrador" and "Usuario" roles are able to execute this endpoint' })
    @ApiTags('Book')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador, Role.Usuario)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('/bookName/:bookName')
    async findBookByName(@Param('bookName') bookName: string):Promise<Book[]>{
        try{
            return await this.bookService.findBookByName(bookName)
        }catch(ex){
            throw new HttpException(`Error while fetching the book by name: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

    /**
     * 
     * /biblioteca/book/genre/{genre}:
     * get:
     *      summary: Get a specific book registered in database by book genre
     *      tags: [Book]
     *      responses: 
     *          200: 
     *              description: get book found by book genre
     *          401:
     *              description: book was not found in database
     *          404:
     *              description: book was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific book registered in database by book genre.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Book was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific book registered in database by book genre. Endpoint applies a LIKE caluse on the search. ONLY users with "Administrador" and "Usuario" roles are able to execute this endpoint' })
    @ApiTags('Book')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador, Role.Usuario)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('/genre/:genre')
    async findBookByGenre(@Param('genre') genre: string):Promise<Book[]>{
        try{
            return await this.bookService.findBookByGenre(genre)
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
     *          201: 
     *              description: New book registered in database
     *          400: 
     *              description: Bad request
     *          401: 
     *              description: User does not have enough permissions to execute this endpoint
     *          403: 
     *              description: Forbidden, user does not have enough permissions
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 201, description: 'New book registered in database.'})
     @ApiResponse({ status: 400, description: 'Bad request.'})
     @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
     @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
     @ApiResponse({ status: 429, description: 'Too many request.'})
     @ApiResponse({ status: 500, description: 'Server side error.'})
     @ApiOperation({ summary: 'Insert a new book in database. ONLY users with "Administrador" role are able to execute this endpoint' })
     @ApiBody({
        type: Book,
        description: 'Insert a new book in database',
     })
    @ApiTags('Book')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *              description: Book deleted correctly.
     *          400: 
     *              description: Bad request
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          404:
     *              description: book was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Book deleted correctly.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Book to delete was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Delete a book from database (hard delete) by id. ONLY users with "Adminstrador" role are able to execute this endpoint' })
    @ApiTags('Book')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          401:
     *              description: Book to update was not found in database
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Book updated correctly.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Book to update was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Update specific book registered in database by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Book')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put(':bookId') 
    async updateBook(@Param('bookId') bookId: number, @Body() newBook : BookDto) { 
        try{
            //let newBook: any = body;
            return await this.bookService.updateBook(bookId, newBook); 
        }catch(ex){
            throw new HttpException(`Error while updating book: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }          
    }

}
