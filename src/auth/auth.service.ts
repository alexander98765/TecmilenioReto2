import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../auth/dto/auth.dto'
import { CreateAuthDto } from './dto/createAuth.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity'
import { Repository } from 'typeorm';

 /**
     * Layer to make all auth operations in database
 */
@Injectable()
export class AuthService {

    /**
      * @param userService - User service to interact with database
      * @param userRepository - User repository to interact with database
      * @private
    */
    constructor(private userService: UserService, private jwtTokenService: JwtService,
               @InjectRepository(User) private userRepository: Repository<User>
    ){}

     /**
     * Validate if users email and password exists in database and match
     *
     * @param username - string, username represented as email
     * @param password - string, users password
     * 
     * @remarks
     * This method validates if email is registered in DB, if not, an exceeption is thrown.
     * Password is validated with bcrypt
     *
     * @returns Account created
     */
    async validateUser(username: string, password: string): Promise<any> {

        const user = await this.userService.findUserByMail(username);        
        if (!user) {          
            throw new HttpException(`Specified email ${user.correoElectronico} does not exist, please user another email, verify your information.`, HttpStatus.BAD_REQUEST);
        }

        const isMatch = await bcrypt.compare(password, user?.contrasena);      

        if(isMatch){
          const { contrasena, ...result } = user;
          return result;
        }else{
          throw new HttpException(`Incorrect password`, HttpStatus.BAD_REQUEST);
        }
        return null;
      }

    /**
     * Charges payload and returns JWT token
     *
     * @param user - any, user
     * 
     * @remarks
     * This method generates payload
     * Payload is returned into the JWT Token
     *
     * @returns access_token JWT Token
    */
    async login(user:any){
        const payload = {
            username: user.nombreUsuario,
            perfil: user.perfil
        };
          return {
            access_token: this.jwtTokenService.sign(payload),
        };
    }

    /**
     * Create a new account
     *
     * @param newAccount - Account object to be inserted in database
     * 
     * @remarks
     * By default, user "perfil" will be "Usuario"
     * This method validates if email already exists in database. If so, an exception is thrown, email is unique per user.
     * The password is encrpted using bcrypt and then included into userdto object 
     *
     * @returns Account created
     */
    async createAccount(newAccount: CreateAuthDto){
      const fixedPerfil:string = "Usuario"
      const fixedActivo:boolean = true;

      const existingUser = await this.userService.findUserByMailResponse(newAccount.correoElectronico, 0)    

      if (existingUser) {         
          throw new HttpException(`Specified email ${newAccount.correoElectronico} already exists, please user another email or login to your account`, HttpStatus.BAD_REQUEST);
      }   

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newAccount.contrasena, salt);

      const newUserHashed: UserDto = { ...newAccount, contrasena: hashedPassword, perfil: fixedPerfil, activo: fixedActivo };
      return await this.userRepository.save(newUserHashed);
    }

    /**
     * Manage users password change
     *
     * @param newInfo - users email and new password
     * 
     * @remarks
     * This method manages the users pasword change. 
     * The password is encrpted using bcrypt and then included into userdto object 
     * This method validates if email already exists. Here the mail searched in DB, must be from another user. IF the user to be updated
     * has the same email, no exception is thrown.
     *
     * @returns Password updated
     */
    async changeNewUserPassword(newInfo: AuthDto) {
      let defulttPassword = "Library1234"
      const user = await this.userService.findUserByMail(newInfo.username);        
      
      if (!user) {                
          throw new HttpException(`Specified email ${newInfo.username} does not exist, please specify another email`, HttpStatus.BAD_REQUEST);
      }       

      const isMatch = await bcrypt.compare(defulttPassword, user?.contrasena);      

      if(isMatch){
        const salt = await bcrypt.genSalt();
        const hashedDefaultPassword = await bcrypt.hash(newInfo.password, salt);
        this.userService.updateUserPassword(hashedDefaultPassword, newInfo.username)      
        throw new HttpException(`Users password was correctly updated`, HttpStatus.OK);
      }else{
        throw new HttpException(`User does not have a default password to change`, HttpStatus.CONFLICT);
      }
    
    }

}