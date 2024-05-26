import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity'
import { UserService } from './user.service';
import { UserController } from './user.controller';

/**
   * Module for users. This module is imported into main app module.
   *
   *@remarks
   * Configure User entity to work with DB
   * Import all user dependencies, controllers, services. (personalized modules)
   * 
*/
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
