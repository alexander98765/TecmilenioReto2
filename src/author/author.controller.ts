import { Controller, Post, Body, Get, Param, Delete, Put, HttpException, HttpStatus  } from '@nestjs/common';
import { AuthorService } from './author.service'
import { Author } from './author.entity'
import { AuthorDto } from './author.dto'

@Controller('author')
export class AuthorController {
    constructor(private authorService : AuthorService){}

    /**
     * 
     * /biblioteca/author:
     * get:
     *      summary: Get all authors registered in database
     *      tags: [Author]
     *      responses: 
     *          200: 
     *              description: get all authors 
     *          404:
     *              description: authors were not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get()
    async findAll(){
        try{
            return await this.authorService.findAll();
        }catch(ex){
            throw new HttpException(`Error while fetching all authors: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

     /**
     * 
     * /biblioteca/author/{id}:
     * get:
     *      summary: Get a specific author registered in database by id
     *      tags: [Author]
     *      responses: 
     *          200: 
     *              description: get author found by id
     *          404:
     *              description: author was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get(':authorId')
    async findAuthor(@Param('authorId') authorId: number){
        try{
            return await this.authorService.findAuthor(authorId)
        }catch(ex){
            throw new HttpException(`Error while fetching the author: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

    /**
     * 
     * /biblioteca/author:
     * post:
     *      summary: Create a new author in database
     *      tags: [Author]
     *      responses: 
     *          200: 
     *              description: author was created in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Post()
    async createAuthor(@Body() newAuthor: AuthorDto){
        try{
            return await this.authorService.createAuthor(newAuthor);
        }catch(ex){
            throw new HttpException(`Error when creating the author: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }          
    }

    /**
     * 
     * /biblioteca/author/{id}:
     * put:
     *      summary: Update information from a specific author in database by id
     *      tags: [Author]
     *      responses: 
     *          200: 
     *              description: author with specified id was updated in database
     *          404:
     *              description: author was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Put(':authorId')
    async updateAuthor(
        @Param('authorId') authorId: number,
        @Body() newAuthor: AuthorDto, 
    ){
        try{
            return await this.authorService.updateAuthor(authorId, newAuthor);
        }catch(ex){
            throw new HttpException(`Error when updating the author: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }        
    }

     /**
     * 
     * /biblioteca/author/{id}:
     * delete:
     *      summary: Delete a specific author in database by id
     *      tags: [Author]
     *      responses: 
     *          200: 
     *              description: author with specified id was deleted from database
     *          404:
     *              description: author was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Delete(':authorId')
    async deleteAuthor(@Param('authorId') authorId: number): Promise<Author> {
        try{
            return await this.authorService.deleteAuthor(authorId);
        }catch(ex){
            throw new HttpException(`Error while deleting author: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

}
