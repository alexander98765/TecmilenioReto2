import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity'
import { Book } from '../book/book.entity'

@Entity({name : 'reservaciones'})
export class Reservation {

    @PrimaryGeneratedColumn() 
    idReservacion: number;

    @ManyToOne(() => User, (user) => user.books)
    @JoinColumn({ name: 'idUsuario' })
    public user: User;
    
    @ManyToOne(() => Book, (book) => book.users)
    @JoinColumn({ name: 'idLibro' })
    public book: Book;

    @Column()
    idLibro: number;

    @Column()
    idUsuario: number;
    
    @Column('date', { default: () => '(CURRENT_DATE)' })
    fechaReservacion: Date;
    
    @Column()
    fechaDevolucion: Date;

}