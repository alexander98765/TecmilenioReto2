import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Book } from '../../book/entity/book.entity'
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents an Author in the catalog
 * 
 * @remarks
 * Corresponding table in database is named "autores"
 * 
 * @public
 */
@Entity({name : 'autores'})
export class Author {

  constructor(idAutor, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento) {
    this.idAutor = idAutor;
    this.nombre = nombre;
    this.apellidoPaterno = apellidoPaterno;
    this.apellidoMaterno = apellidoMaterno;
    this.fechaNacimiento = fechaNacimiento
  }

  /**
    * Author unique identificator
    * @public
  */
  @PrimaryGeneratedColumn() 
  idAutor: number;

  /**
    * Authors name
    * @public
  */
  @ApiProperty({
    example: 'Hermann',
    required: true
  })
  @Column()
  nombre: string;

  /**
    * Authors last name
    * @public
  */
  @ApiProperty({
    example: 'Hesse',
    required: true
  })
  @Column()
  apellidoPaterno: string;

  /**
    * Authors maternal last name
    * @public
  */
  @ApiProperty({
    example: 'Hesse',
    required: false
  })
  @Column() 
  apellidoMaterno: string;

  /**
    * Authors birthdate
    * @public
  */
  @ApiProperty({
    example: '1877-07-02',
    required: false
  })
  @Column()
  fechaNacimiento: Date;

  /**
    * Represents a relation with the book class.
    * 
    * @remarks 
    * Used to indicate which author wrote which book
    * One to many relationship was used.
    * 
    * @public
  */
  @OneToMany( () => Book, book => book.author)
  books: Book[]
}