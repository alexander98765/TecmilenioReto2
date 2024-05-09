import { Controller, Post, Body, Get, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service'
import { User } from './user.entity'
import { UserDto } from './user.dto'

@Controller('user')
export class UserController {
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
     *          404:
     *              description: users were not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get()
    async findAll(): Promise<User[]>{
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
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
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
     * /biblioteca/user:
     * post:
     *      summary: Create a new user in database
     *      tags: [User]
     *      responses: 
     *          200: 
     *              description: user was created in database
     *          500: 
     *              description: error in server side
     *  
     */
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
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
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
     *          404:
     *              description: user was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
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
