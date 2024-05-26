import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "./auth.service";

/**
 * Represents a class to create localstrategy with passport
 * 
 * @extends PassportStrategy
 * 
 * @remarks
 * Validates against local credentials stored in DB(email and password)
 * 
 * @public
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    /**
      * @param authService - Auth service to interact with database
      * @private
    */
    constructor(private authService: AuthService) {
        /*super({
            usernameField: 'correoElectronico',
        });*/
        super()
    }

    /**
     * Calls service method to Validate if users email and password exists in database and match
     *
     * @param username - string, username represented as email
     * @param password - string, users password
     * 
     * @remarks
     * This method validates if email is registered in DB, if not, an exceeption is thrown.
     * If creetials are correct, a user object is returned
     *
     * @returns user User object 
     */
    async validate(username: string, password:string): Promise<any> {
        const user = await this.authService.validateUser(username, password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}