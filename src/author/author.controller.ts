import { Controller, Post, Body, Get, Param, Delete, Put, HttpException, HttpStatus, UseGuards  } from '@nestjs/common';
import { AuthorService } from './author.service'
import { Author } from './entity/author.entity'
import { AuthorDto } from './dto/author.dto'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '../user/role.enum';
import { HasRoles } from '../auth/has-roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * Represents a class to expose Author endpoints
 * 
 * @remarks
 * Endpoints can be found using prefix "author"
 * Endpoints use rate limiting
 * 
 * @public
 */
@SkipThrottle({ default: false })
@Controller('author')
export class AuthorController {

    /**
    * @param authorService - Insntace of author service to make operations in database.
    * @private
    */
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
     *          400: 
     *              description: bad request
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: authors were not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get all authors registered in database.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Authors were not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get all authors registered in database. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Author')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *              description: get author by id
     *          400: 
     *              description: bad request
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: author was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 200, description: 'Specific author registered in database by id.'})
     @ApiResponse({ status: 400, description: 'Bad request.'})
     @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
     @ApiResponse({ status: 404, description: 'Author was not found in database.'})
     @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
     @ApiResponse({ status: 429, description: 'Too many request.'})
     @ApiResponse({ status: 500, description: 'Server side error.'})
     @ApiOperation({ summary: 'Get specific author registered in database by id. ONLY users with "Administrador" role are able to execute this endpoint' })
     @ApiTags('Author')
     @ApiBearerAuth()
     @HasRoles(Role.Administrador)
     @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get(':authorId')
    async findAuthorById(@Param('authorId') authorId: number){
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
     *          201: 
     *              description: New author registered in database
     *          400: 
     *              description: bad request
     *          401: 
     *              description: User does not have enough permissions to execute this endpoint.
     *          403: 
     *              description: Forbidden, user does not have enough permissions.
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 201, description: 'New author registered in database.'})
     @ApiResponse({ status: 400, description: 'Bad request.'})
     @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
     @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
     @ApiResponse({ status: 429, description: 'Too many request.'})
     @ApiResponse({ status: 500, description: 'Server side error.'})
     @ApiOperation({ summary: 'Insert a new author in database. ONLY users with "Administrador" role are able to execute this endpoint' })
     @ApiBody({
        type: Author,
        description: 'Insert a new author in database',
     })
    @ApiTags('Author')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          400: 
     *              description: bad request
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          404:
     *              description: Author to update was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Author updated correctly.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Author to update was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Update specific author registered in database by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Author')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          400: 
     *              description: bad request
     *          404:
     *              description: author was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 200, description: 'Author with specified id was deleted from database.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Author to delete was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Delete an author from database (hard delete) by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Author')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':authorId')
    async deleteAuthor(@Param('authorId') authorId: number): Promise<Author> {
        try{
            return await this.authorService.deleteAuthor(authorId);
        }catch(ex){
            throw new HttpException(`Error while deleting author: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

}
