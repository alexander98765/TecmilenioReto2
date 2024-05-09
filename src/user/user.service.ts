import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity'
import { UserDto } from './user.dto'
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';
import { NotFoundException } from '../filters/NotFoundException';

@Injectable()
export class UserService {

    /**
    * @param userRepository - User repository to interact with database
    */
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

     /**
     * Get all users found in database
     *
     * @returns An object of type User found in database
     */
    async findAll(): Promise<User[]> {
        const users = await this.userRepository.find(); 
        if(users.length == 0){
            throw new NotFoundException(`Users were not found`);
        }
        return users;
    }

    /**
     * Get a specific user found in database
     *
     * @param id - the user id
     *
     * @returns An array of type User found in database
     */
    async findUser(id: number) : Promise<User> {        
        const user = await this.userRepository.findOne({
            where: { idUsuario:id }
        });
        if(!user){
            throw new HttpException(`Specified user id ${id} was not found`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return user;                    
    }

    /**
     * Create a new user in database
     *
     * @param newUser - User object to be inserted in database
     *
     * @returns User created
     */
    async createUser(newUser: UserDto) {        
        return await this.userRepository.save(newUser);         
    }

    /**
     * Delete an existing user in database
     *
     * @param userId - Author id to be deleted
     *
     * @returns response confirmation
     */
    async deleteUser(userId: number): Promise<any> {
        return await this.userRepository.delete({ idUsuario : userId });               
    }

    /**
     * Update information of an existing user in database
     *
     * @param userId - User id to be updated
     * @param newUser - User object to be updated in database
     *
     * @returns User updated
     */
    async updateUser(userId: number, newUser: UserDto) {
        let toUpdate = await this.userRepository.findOne({where: { idUsuario:userId }});
        if(!toUpdate){
            throw new HttpException(`Specified user id ${userId} was not found`, HttpStatus.NOT_FOUND)
        } 
        let updated = Object.assign(toUpdate, newUser); 
        return this.userRepository.save(updated); 
    }

}
