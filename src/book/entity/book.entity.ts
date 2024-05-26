import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Author } from '../../author/entity/author.entity'
import { Reservation } from '../../reservation/entity/reservation.entity'
import { User } from '../../user/entity/user.entity'
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a Book in the catalog
 * 
 * @remarks
 * Corresponding table in database is named "libros"
 * 
 * @public
 */
@Entity({name : 'libros'})
export class Book {

  /**
    * Book unique identificator
    * @public
  */
  @PrimaryGeneratedColumn() 
  idLibro: number;

  /**
    * Books name
    * @public
  */
  @ApiProperty({
    example: 'El lobo estepario',
    required: true
  })
  @Column()
  nombre: string;

  /**
    * Books total pages
    * @public
  */
  @ApiProperty({
    example: '320',
    required: true
  })
  @Column()
  totalPaginas: string;

  /**
    * Books editorial
    * @public
  */
  @ApiProperty({
    example: 'Editorial patito',
    required: true
  })
  @Column() 
  editorial: string;

  /**
    * Books publication date
    * @public
  */
  @ApiProperty({
    example: '1997-05-21',
    required: true
  })
  @Column({ type: 'datetime'})
  fechaPublicacion: Date;

  /**
    * Books genre
    * @public
  */
  @ApiProperty({
    example: 'Novela',
    required: true
  })
  @Column()
  genero: string;

  /**
    * Books description
    * @public
  */
  @ApiProperty({
    example: 'El libro se desarrolla a través de unos manuscritos creados por el propio protagonista, Harry Haller, los cuales son presentados al lector por un conocido de Harry en la introducción de la obra. Dentro de los manuscritos se narran los problemas, la vida del protagonista y su difícil relación con el mundo y consigo mismo.',
    required: true
  })
  @Column()
  descripcion: string;

  /**
    * foreign key from authors
    * @public
  */
  @ApiProperty({
    example: 6,
    required: true
  })
  @Column()
  idAutor: number;

  /**
    * Represents a relation with the author class.
    * 
    * @remarks 
    * Used to indicate which author wrote the book
    * Many To One relationship was used.
    * idAutor key was used to make realtionship
    * 
    * @public
  */
  @ManyToOne( () => Author, author => author.books)
  @JoinColumn({ name: 'idAutor' })
  author: Author

  /**
    * Represents a relation with the reservation class.
    * 
    * @remarks 
    * Used to indicate the reservation where the book was reservated
    * One to Many relationship was used.
    * 
    * @public
  */
  @OneToMany(() => Reservation, (reservation) => reservation.book)
  public users: User[];

}