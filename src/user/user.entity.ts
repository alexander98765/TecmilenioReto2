import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from '../reservation/reservation.entity'
import { Book } from '../book/book.entity'

@Entity({name : 'usuarios'})
export class User {

  @PrimaryGeneratedColumn() 
  idUsuario: number;

  @Column()
  nombre: string;

  @Column()
  apellidoPaterno: string;

  @Column() 
  apellidoMaterno: string;

  @Column()
  edad: string;

  @Column()
  correoElectronico: string;

  @Column()
  perfil: string;

  @Column()
  activo: boolean;

  @Column()
  fechaAlta: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  public books: Book[];

}