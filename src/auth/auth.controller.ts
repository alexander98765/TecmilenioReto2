import { Controller, Get, Post, Request, UseGuards, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { CreateAuthDto } from './dto/createAuth.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

/**
 * Represents a class to expose Auth endpoints
 * 
 * @remarks
 * Endpoints can be found using prefix "auth"
 * Endpoints use rate limiting
 * 
 * @public
 */
@Controller('auth')
export class AuthController {

  /**
    * @param authService - Insntace of auth service to make operations in database.
    * @private
    */
  constructor(private authService: AuthService){}

  /**
     * 
     * /biblioteca/auth/login:
     * post:
     *      summary: Login a specific user and return temporary jwt token
     *      tags: [Auth]
     *      responses: 
     *          201: 
     *              description: User was authenticated correctly. A temporary JWT token will be delivered to user.
     *          400:
     *              description: Bad request
     *          401:
     *              description: Users credentials do not match.
     *          403:
     *              description: Forbidden, user does not have enough permissions to access this endpoint.
     *          404:
     *              description: user was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: error in server side
     *  
     */
  @ApiResponse({ status: 201, description: 'User was authenticated correctly. A temporary JWT token will be delivered to user.'})
  @ApiResponse({ status: 400, description: 'Bad request.'})
  @ApiResponse({ status: 401, description: 'Users credentials do not match.'})
  @ApiResponse({ status: 404, description: 'User was not found in database.'})
  @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions to access this endpoint.'})
  @ApiResponse({ status: 429, description: 'Too many request.'})
  @ApiResponse({ status: 500, description: 'Server side error.'})
  @ApiOperation({ summary: 'Allows users to login to their account and returns a temporary JWT token.' })
  //@ApiParam({name: 'password', required: true, description: 'User´s password'})
  //@ApiParam({name: 'username', required: true, description: 'User´s email'})  
  @ApiOkResponse({
    description: 'If user was logged in correctly, a temporary token will be given to user.',
    type: "JWT temporary Token",
    isArray: true
  })
  @ApiTags('Authentication')
  @ApiBody({
      type: AuthDto,
      description: 'Login to get a temporary token and get access to the bliblioteca endpoints',
  })
  @SkipThrottle({ default: false })
  @Throttle( { default: { ttl: 30000, limit: 3 } })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }  


  /**
     * 
     * /biblioteca/auth/newAccount:
     * post:
     *      summary: Register a new account, user will be registered by default with "Usuario" rol
     *      tags: [Auth]
     *      responses: 
     *          201: 
     *              description: User was registered correctly.
     *          400:
     *              description: Bad request
     *          401:
     *              description: Users credentials do not match.
     *          403:
     *              description: Forbidden, user does not have enough permissions to access this endpoint.
     *          404:
     *              description: user was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: error in server side
     *  
     */
  @ApiResponse({ status: 201, description: 'User was authenticated correctly. A temporary JWT token will be delivered to user.'})
  @ApiResponse({ status: 400, description: 'Bad request.'})
  @ApiResponse({ status: 401, description: 'Users credentials do not match.'})
  @ApiResponse({ status: 404, description: 'User was not found in database.'})
  @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions to access this endpoint.'})
  @ApiResponse({ status: 429, description: 'Too many request.'})
  @ApiOperation({ summary: 'Allows users to create a new account. By default, inserted "perfil" is "Usuario". 8 characters min, 10 characters nax, at least 1 upper case, at least 1 lower case, at least 1 number, at least 1 symbol.' })
  @ApiTags('Authentication')
  @SkipThrottle({ default: false })
  @Throttle( { default: { ttl: 30000, limit: 3 } })
  @Post('newAccount')
  async createAccount(@Body() newAccount: CreateAuthDto){
    return this.authService.createAccount(newAccount);
  }


  /**
     * 
     * /biblioteca/auth/changePassword:
     * post:
     *      summary: Endpoint that allows new users to change their password
     *      tags: [Auth]
     *      responses: 
     *          200: 
     *              description: Password was changed correctly.
     *          400:
     *              description: Bad request
     *          403:
     *              description: Forbidden, user does not have enough permissions to access this endpoint.
     *          404:
     *              description: User was not found in database
     *          409:
     *              description: Users password was not modified
     *          429:
     *              description: Too many request
     *          500: 
     *              description: error in server side
     *  
     */
  @ApiResponse({ status: 200, description: 'Users password was changed correctly.'})
  @ApiResponse({ status: 400, description: 'Bad request.'})
  @ApiResponse({ status: 401, description: 'Users credentials do not match.'})
  @ApiResponse({ status: 404, description: 'User was not found in database.'})
  @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions to access this endpoint.'})
  @ApiResponse({ status: 409, description: 'Users password was not modified.'})
  @ApiResponse({ status: 429, description: 'Too many request.'})
  @ApiResponse({ status: 500, description: 'Server side error.'})
  @ApiOperation({ summary: 'Endpoint that allows new users to change their default password for a personalized one. 8 characters min, 10 characters nax, at least 1 upper case, at least 1 lower case, at least 1 number, at least 1 symbol.' })
  @ApiTags('Authentication')
  @Post('changePassword')
  async changeNewUserPassword(@Body() newInfo: AuthDto){
    try{
      return this.authService.changeNewUserPassword(newInfo);
    }catch(ex){
      throw new HttpException(`Error while updating users password: ${ex}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


}