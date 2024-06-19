import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entity/user.entity'
import { UserDto } from './dto/user.dto'
import { InjectRepository } from '@nestjs/typeorm'; 
import { Not, Repository } from 'typeorm';
import { NotFoundException } from   '../filters/NotFoundException';
import * as bcrypt from 'bcrypt';

 /**
     * Layer to make all users operations in database
 */
@Injectable()
export class UserService {

    /**
    * @param userRepository - User repository to interact with database
    * @private
    */
    constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

     /**
     * Get all users found in database
     *
     * @returns An object of type User found in database
     */
    async findAll(): Promise<User[]> {        
        const users = await this.userRepository.find();         
        //if(users.length == 0){
        if(users == null){
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
        if(user == null){
        //if(!user){
            throw new HttpException(`Specified user id ${id} was not found`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return user;                    
    }

    /**
     * Get a specific user by email in database
     *
     * @param correoElectronico - the user email
     *
     * @returns An object of type User found in database
     */
    async findUserByMail(correoElectronico: string) : Promise<User> {        
        const user = await this.userRepository.findOne({
            where: { correoElectronico }
        });
        if(!user){
            throw new HttpException(`Specified user by email ${correoElectronico} was not found`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return user;                    
    }

    /**
     * Validate if a specific user by email is in database
     *
     * @param correoElectronico - Email to be compared in database
     *
     * @returns flag - if user by email exists in database
     */
    async findUserByMailResponse(correoElectronico: string, idUsuario: number) : Promise<boolean> {        
        let flag: boolean = false;
        let user: any;
        if(idUsuario == 0){
            user = await this.userRepository.findOne({
                where: { correoElectronico }
            });            
        }else{
            user = await this.userRepository.findOne({
                where: { correoElectronico , idUsuario: Not(idUsuario)}
            });
        }       
        if(user){
            if(user.correoElectronico == correoElectronico){
                flag = true;            
            }
        }            
        return flag;                    
    }

    /**
     * Create a new user in database
     *
     * @param newUser - User object to be inserted in database
     * 
     * @remarks
     * This method validates if email already exists in database. If so, an exception is thrown, email is unique per user.
     * The password is encrpted using bcrypt and then included into userdto object 
     *
     * @returns User created
     */
    async createUser(newUser: UserDto) {   
        let defulttPassword = "Library1234"
        const existingUser = await this.findUserByMailResponse(newUser.correoElectronico, 0)       
        if (existingUser ) {            
            throw new HttpException(`Specified email ${newUser.correoElectronico} already exists, use another email or login to your account.`, HttpStatus.BAD_REQUEST);
        } 
        const salt = await bcrypt.genSalt();
        //const hashedPassword = await bcrypt.hash(newUser.contrasena, salt);        
        const hashedPassword = await bcrypt.hash(defulttPassword, salt);        
        const newUserHashed: UserDto = { ...newUser, contrasena: hashedPassword };
        return await this.userRepository.save(newUserHashed);         
    }

    /**
     * Delete an existing user in database
     *
     * @param userId - Author id to be deleted
     *
     * @returns response confirmation
     */
    async deleteUser(userId: number): Promise<any> {
        let toDelete = await this.userRepository.findOne({where: { idUsuario:userId }});     
        if(toDelete == null){
        //if(!toDelete){
            throw new HttpException(`Specified user id ${userId} was not found to delete`, HttpStatus.NOT_FOUND)
        } 
        return await this.userRepository.delete({ idUsuario : userId });               
    }

    /**
     * Update information of an existing user in database
     *
     * @param userId - User id to be updated
     * @param newUser - User object to be updated in database
     *
     * @remarks
     * This method validates if user to update exists, if not, an exception is thrown
     * The password is encrpted using bcrypt and then included into userdto object 
     * This method validates if email already exists. Here the mail searched in DB, must be from another user. IF the user to be updated
     * has the same email, no exception is thrown.
     * 
     * @returns User updated
     */
    async updateUser(userId: number, newUser: UserDto) {
        let toUpdate = await this.userRepository.findOne({where: { idUsuario:userId }});
        if(toUpdate == null){
        //if(!toUpdate){
            throw new HttpException(`Specified user id ${userId} was not found to update`, HttpStatus.NOT_FOUND)
        }         
        const existingUser = await this.findUserByMailResponse(newUser.correoElectronico, userId)                
        if (existingUser) {            
            throw new HttpException(`Specified email ${newUser.correoElectronico} already exists, use another email.`, HttpStatus.BAD_REQUEST);
        }
        //const salt = await bcrypt.genSalt();
        //const hashedPassword = await bcrypt.hash(newUser.contrasena, salt);        
        const newUserHashed: UserDto = { ...newUser, contrasena: toUpdate.contrasena };
        let updated = Object.assign(toUpdate, newUserHashed); 
        return this.userRepository.save(updated); 
    }

    /**
     * Update users password
     *
     * @param newPassword - Users new password to be set
     * @param email - Users email
     *
     * @remarks
     * This method changes the default password for the custom one     
     * 
     * @returns User updated
    */
    async updateUserPassword(newPassword: string, email: string){
        this.userRepository
            .createQueryBuilder()
            .update(User)
            .set({ contrasena: newPassword })
            .where('correoElectronico = :email', { email: email })
            .execute();
    }

}
