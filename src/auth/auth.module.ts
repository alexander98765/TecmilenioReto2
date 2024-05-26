import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity'
import { UserController } from '../user/user.controller'
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';

/**
   * Module for auth. This module is imported into main app module.
   *
   *@remarks
   * Configure UserModule, PassportModule(local), JwtModule (jwt)  entity to work with DB relations.
   * Import all users and auth dependencies, controllers and services. (personalized modules)
   * 
*/
@Module({
    imports: [
      UserModule,
      PassportModule,  
      TypeOrmModule.forFeature([User]),
      JwtModule.register({
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '12h'}
      })
    ],
    controllers: [UserController, AuthController],
    providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
    exports: [UserService, AuthService]
})
export class AuthModule {}