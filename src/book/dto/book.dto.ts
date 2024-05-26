import { ApiProperty } from "@nestjs/swagger";
import { IsISO8601, IsInt, IsNotEmpty, IsString } from 'class-validator';

/**
  * Represents a Book DTO to create and update records
  * @public
*/
export class BookDto {
  
  /**
    * Books name
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'El lobo estepario',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  readonly nombre: string;
  
  /**
    * Books total pages
    * @readonly
    * @public
  */
  @ApiProperty({
    example: '320',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  readonly totalPaginas: string;

  /**
    * Books editorial
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'Editorial patito',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  readonly editorial: string;

  /**
    * Books publication date
    * @readonly
    * @public
  */
  @ApiProperty({
    example: '1995-02-25',
    required: true
  })
  @IsNotEmpty()
  @IsISO8601()
  readonly fechaPublicacion: Date;

  /**
    * Books genre
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'Novela',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  readonly genero: string;

  /**
    * Books description
    * @readonly
    * @public
  */
  @ApiProperty({
    example: 'El libro se desarrolla a través de unos manuscritos creados por el propio protagonista, Harry Haller, los cuales son presentados al lector por un conocido de Harry en la introducción de la obra. Dentro de los manuscritos se narran los problemas, la vida del protagonista y su difícil relación con el mundo y consigo mismo.',
    required: true
  })
  @IsString()
  readonly descripcion: string;

  /**
    * foreign key from authors
    * @readonly
    * @public
  */
  @ApiProperty({
    example: '6',
    required: true
  })
  @IsInt()
  readonly idAutor: number;
}