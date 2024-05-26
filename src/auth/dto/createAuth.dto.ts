import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from 'class-validator';
import { Column } from 'typeorm';

/**
    * Represents an Auth DTO to create new public acounts
    * @public
*/
export class CreateAuthDto {

    /**
        * Users name
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'Alejandro',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    readonly nombre: string;

    /**
        * Users last name
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'Pérez',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    readonly apellidoPaterno: string;

    /**
        * Users maternal last name
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'Morales',
        required: false
    })
    @IsString()
    readonly apellidoMaterno: string;

    /**
        * Users age
        * @public
        * @readonly
    */
    @ApiProperty({
        example: '30',
        required: true
    })
    @IsNotEmpty()
    readonly edad: string;

    /**
        * Users email
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'alex@gmail.com',
        required: true
    })
    @IsEmail()
    readonly correoElectronico: string;

    /**
        * Users created date
        * @public
        * @readonly
    */
    readonly fechaAlta: Date;

    /**
        * Users nick name
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'AlexPerez',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    readonly nombreUsuario: string;

    /**
        * Users password
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'Password123',
        required: true
    })
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(10)
    @IsStrongPassword({    
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    readonly contrasena: string;
  }