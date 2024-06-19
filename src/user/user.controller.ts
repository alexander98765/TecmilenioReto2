import { Controller, Post, Body, Get, Param, Delete, Put, HttpException, HttpStatus, UseGuards, ConsoleLogger } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './entity/user.entity'
import { UserDto } from './dto/user.dto'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../user/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle, ThrottlerGuard } from '@nestjs/throttler';

/**
 * Represents a class to expose User endpoints
 * 
 * @remarks
 * Endpoints can be found using prefix "user"
 * Endpoints use rate limiting
 * 
 * @public
 */
@SkipThrottle({ default: false })
@Controller('user')
export class UserController {

    /**
    * @param userService - Insntace of user service to make operations in database.
    * @private
    */
    constructor(private userService : UserService){}

    /**
     * 
     * /biblioteca/user:
     * get:
     *      summary: Get all users registered in database
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: get all users 
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: users were not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get all users registered in database.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Users were not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get all users registered in database. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('User')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)        
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get()
    async findAll(){
        try{            
            return await this.userService.findAll();
        }catch(ex){
            throw new HttpException(`Error while fetching all users: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }         
    }

    /**
     * 
     * /biblioteca/user/{id}:
     * get:
     *      summary: Get a specific user registered in database by id
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: get user found by id
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific user registered in database by id.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'User was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific user registered in database by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('User')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get(':userId')
    async findUser(@Param('userId') userId: number){
        try{
            const user = await this.userService.findUser(userId) 
            return user;
        }catch(ex){
            throw new HttpException(`Error while fetching the user: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }                            
    }

    /**
     * 
     * /biblioteca/us/user:
     * get:
     *      summary: Search a user by email in database
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: user was found in database
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific user registered in database by email.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'User was not found in database with email provided.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific user registered in database by email. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('User')
    @ApiBearerAuth()
    @Get('/us/:email')
    async findUserByName(@Param('email') correoElectronico: string){
        try{
            const user = await this.userService.findUserByMail(correoElectronico) 
            return user;
        }catch(ex){
            throw new HttpException(`Error while fetching the user by name: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }                            
    }

     /**
     * 
     * /biblioteca/user:
     * post:
     *      summary: Create a new user in database
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: user was created in database
     *          201: 
     *              description: user found in database
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 201, description: 'New user registered in database.'})
     @ApiResponse({ status: 400, description: 'Bad request.'})
     @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
     @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
     @ApiResponse({ status: 500, description: 'Server side error.'})
     @ApiOperation({ summary: 'Insert a new user including sensitive fields. Password is set to default password. User can change it in "changePassword" endpoint. ONLY users with "Administrador" role are able to execute this endpoint' })
     @ApiBody({
        type: User,
        description: 'Insert a new user including sensitive fields',
     })
    @ApiTags('User')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Post()
    createUser(@Body() newUser: UserDto){
        try{            
            return this.userService.createUser(newUser);   
        }catch(ex){
            throw new HttpException(`Error while creating the user ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }        
    }

    /**
     * 
     * /biblioteca/user/{id}:
     * delete:
     *      summary: Delete a specific user in database by id
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: user with specified id was deleted from database
     *          400:
     *              description: Bad request
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'User deleted correctly.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'User to delete was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Delete a user from database (hard delete) by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('User')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':userId')
    async deleteUser(@Param('userId') userId: number): Promise<User> {
        try{
            return await this.userService.deleteUser(userId);
        }catch(ex){
            throw new HttpException(`Error while deleting user: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }          
    }

    /**
     * 
     * /biblioteca/user/{id}:
     * put:
     *      summary: Update information from a specific user in database by id
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: user with specified id was updated in database
     *          401:
     *              description: User does not have enough permissions to execute this endpoint
     *          403:
     *              description: Forbidden, user does not have enough permissions
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'User updated correctly.'})    
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'User to update was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Update specific user registered in database by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('User')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Put(':userId')
    async updateUser(
        @Param('userId') userId: number,
        @Body() newUser: UserDto, 
    ) {
        try{
            return await this.userService.updateUser(userId, newUser);
        }catch(ex){
            throw new HttpException(`Error while updating user: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }        
    }

}
