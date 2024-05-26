import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from './constants';
import { Injectable } from "@nestjs/common";

/**
 * Represents a strategy to look for a JWT Authorization 
 * 
 * @public
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    /**
      * @param jwtFromRequest - Indicate Authorization request
      * @param ignoreExpiration - Indicate if token expiration time will be ignored
      * @param secretOrKey - indicate secret key path
      * @private
    */
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,    
            secretOrKey: jwtConstants.secret
        })
    }

    /**
     * This strategy will look for a JWT in the Authorization header, validate it against the secretKey, and return the payload if valid
     *
     * @param payload - any, payload returned in login method from  authservice     
     *
     * @returns payoad information
     */
    async validate(payload: any) {
        return {userName: payload.username, perfil: payload.perfil}
    }

}