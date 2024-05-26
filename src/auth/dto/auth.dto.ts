import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../user/role.enum';
import { IsStrongPassword, Matches, MaxLength, MinLength } from 'class-validator';

/**
    * Represents an Auth DTO to login into system
    * @public
*/
export class AuthDto {

  /**
        * Users email
        * @public
        * @readonly
  */
  @ApiProperty({
    example: 'alex@gmail.com',
    required: true
  })
  readonly username: string;
  
  /**
        * Users password
        * @public
        * @readonly
    */
  @ApiProperty({
    example: 'alex123',
    required: true
  })
  @MinLength(8)
  @MaxLength(10)
  @IsStrongPassword({    
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  readonly password: string;

  /**
        * Users role
        * @public
        * @readonly
    */
  readonly perfil: Role[];

  }