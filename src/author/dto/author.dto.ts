import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';

/**
    * Represents an Author DTO to create  and update records
    * @public
  */
export class AuthorDto {

  /**
    * Authors name
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'Hermann',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;

  /**
    * Authors last name
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'Hesse',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  readonly apellidoPaterno: string;

  /**
    * Authors maternal last name
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'Hesse',
    required: false
  })
  @IsString()
  readonly apellidoMaterno: string;

  /**
    * Authors birthday
    * @readonly
    * @public
  */
  @ApiProperty({
    example: '1877-07-02',
    required: false
  })
  @IsISO8601()
  @IsNotEmpty()
  readonly fechaNacimiento: Date;    
  
  }