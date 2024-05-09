import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Author } from '../author/author.entity'
import { Reservation } from '../reservation/reservation.entity'
import { User } from '../user/user.entity'

@Entity({name : 'libros'})
export class Book {

  @PrimaryGeneratedColumn() 
  idLibro: number;

  @Column()
  nombre: string;

  @Column()
  totalPaginas: string;

  @Column() 
  editorial: string;

  @Column({ type: 'datetime'})
  fechaPublicacion: Date;

  @Column()
  genero: string;

  @Column()
  descripcion: string;

  @Column()
  idAutor: number;

  @ManyToOne( () => Author, author => author.books)
  @JoinColumn({ name: 'idAutor' })
  author: Author

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  public users: User[];

}