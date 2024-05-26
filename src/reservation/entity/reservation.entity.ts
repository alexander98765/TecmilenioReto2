import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity'
import { Book } from '../../book/entity/book.entity'
import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a Reservation in the catalog
 * 
 * @remarks
 * Corresponding table in database is named "reservaciones"
 * 
 * @public
 */
@Entity({name : 'reservaciones'})
export class Reservation {

    /**
        * Reservation unique identificator
        * @public
    */
    @PrimaryGeneratedColumn() 
    idReservacion: number;

    /**
        * Represents a relation with the User class.
        * 
        * @remarks 
        * Used to indicate which user made a reservation
        * Many to one relationship was used.
        * idUsuario key was used to make realtionship
        * 
        * @public
    */
    @ManyToOne(() => User, (user) => user.books)
    @JoinColumn({ name: 'idUsuario' })
    public user: User;
    
    /**
        * Represents a relation with the Book class.
        * 
        * @remarks 
        * Used to indicate which book was reservated
        * Many to one relationship was used.
        * idLibro key was used to make realtionship
        * 
        * @public
    */
    @ManyToOne(() => Book, (book) => book.users)
    @JoinColumn({ name: 'idLibro' })
    public book: Book;

    /**
        * Foreign key from book entity
        * @public
    */
    @ApiProperty({
       example: 15,
       required: true
    })
    @Column()
    idLibro: number;

    /**
        * Foreign key from user entity
        * @public
    */
    @ApiProperty({
        example: 14,
        required: true
    })
    @Column()
    idUsuario: number;
    
    /**
        * Date when reservation was made. Automatic date
        * @public
    */
    @Column('date', { default: () => '(CURRENT_DATE)' })
    fechaReservacion: Date;
    
    /**
        * Date when book should be given back to library
        * @public
    */
    @ApiProperty({
        example: '2024-06-23',
        required: true
    })
    @Column()
    fechaDevolucion: Date;

    /**
        * Folio for user to give a following of the reservation
        * @public
    */
    @Column()
    folioReservacion: string;

    /**
        * Current reservation status.
        * @public
    */
    @Column()
    estatusReservacion: string;

}