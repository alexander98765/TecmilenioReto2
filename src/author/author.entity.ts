import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Book } from '../book/book.entity'

@Entity({name : 'autores'})
export class Author {

  @PrimaryGeneratedColumn() 
  idAutor: number;

  @Column()
  nombre: string;

  @Column()
  apellidoPaterno: string;

  @Column() 
  apellidoMaterno: string;

  @Column()
  fechaNacimiento: Date;

  @OneToMany( () => Book, book => book.author)
  books: Book[]
}