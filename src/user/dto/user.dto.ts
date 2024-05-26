import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsEmpty, IsNotEmpty, IsString, Matches } from 'class-validator';

/**
    * Represents a User DTO to create  and update records
    * @public
  */
export class UserDto {

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
        * Users first name
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
        * Users last name
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
        * Users role to enable/disable endpoints
        * @public
        * @readonly
    */
    @ApiProperty({
        example: 'Administrador',
        required: true
    })
    @IsNotEmpty()
    @IsString()
    readonly perfil: string;

    /**
        * Indicates if user is active or not
        * @public
        * @readonly
    */
    @ApiProperty({
        example: true,
        required: true
    })
    @IsNotEmpty()
    readonly activo: boolean;

    /**
        * Date where user was created in DB. Automatic date
        * @public
        * @readonly
    */
    readonly fechaAlta: Date;

    /**
        * Users nickname
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
    /*@ApiProperty({
        example: 'Password123',
        required: true
    })*/
    @IsEmpty()
    readonly contrasena: string;
  }