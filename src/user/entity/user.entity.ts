import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservation/entity/reservation.entity'
import { Book } from '../../book/entity/book.entity'
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a User in the catalog
 * 
 * @remarks
 * Corresponding table in database is named "usuarios"
 * 
 * @public
 */
@Entity({name : 'usuarios'})
export class User {

  /**
    * User unique identificator
    * @public
  */
  @PrimaryGeneratedColumn() 
  idUsuario: number;

  /**
    * Users name
    * @public
  */
  @ApiProperty({
    example: 'Alejandro',
    required: true
  })
  @Column()
  nombre: string;

  /**
    * Users last name
    * @public
  */
  @ApiProperty({
    example: 'Pérez',
    required: true
  })
  @Column()
  apellidoPaterno: string;

  /**
    * Users maternal last name
    * @public
  */
  @ApiProperty({
    example: 'Morales',
    required: false
  })
  @Column() 
  apellidoMaterno: string;

  /**
    * Users age
    * @public
  */
  @ApiProperty({
    example: '30',
    required: true
  })
  @Column()
  edad: string;

  /**
    * Users email
    * @public
  */
  @ApiProperty({
    example: 'alex@gmail.com',
    required: true
  })
  @Column()
  correoElectronico: string;

  /**
    * Users role to enable/disable endpoints
    * @public
  */
  @ApiProperty({
    example: 'Administrador',
    required: true
  })
  @Column()
  perfil: string;

  /**
    * Indicates if user is active or not
    * @public
  */
  @ApiProperty({
    example: true,
    required: true
  })
  @Column()
  activo: boolean;

  /**
    * Date where user was created in DB. Automatic date
    * @public
  */
  @Column()
  fechaAlta: Date;

  /**
    * Users nickname
    * @public
  */
  @ApiProperty({
    example: 'AlexPerez',
    required: true
  })
  @Column()
  nombreUsuario: string;

  /**
    * Users password
    * @public
  */
  /*@ApiProperty({
    example: 'Password123',
    required: true
  })*/
  @Column()
  contrasena: string;

  /**
    * Represents a relation with the reservation class.
    * 
    * @remarks 
    * Used to indicate which user made a certain book reservation
    * One to many relationship was used.
    * 
    * @public
  */
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  public books: Book[];

}

