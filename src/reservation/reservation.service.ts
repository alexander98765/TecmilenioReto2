import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reservation } from './reservation.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
import { ReservationDto } from './reservation.dto'
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';


@Injectable()
export class ReservationService {
    
    /**
    * @param reservationRepository - Reservation repository to interact with database
    * @param bookService - Book repository to interact with database
    * @param userService - User repository to interact with database
    */
    constructor(@InjectRepository(Reservation) private reservationRepository: Repository<Reservation>,
                                 private bookService: BookService,
                                 private userService: UserService) {}

    /**
     * Get all RESERVATIONS found in database
     *
     * @returns An object of type Reservation found in database
     */
    async findAll() {
        const reservations = await this.reservationRepository.find({
            relations: {
                user: true,
                book: true
            },
            select: {                
                user: {
                    nombre: true,
                    apellidoPaterno: true,
                    apellidoMaterno: true,
                    correoElectronico: true
                },
                book: {
                    nombre: true,
                    editorial: true,
                    genero: true,
                    totalPaginas: true
                }
            },
        });
        if(reservations.length == 0){
            throw new HttpException(`No reservations were found in database`, HttpStatus.NOT_FOUND)
        }
        return reservations;        
    }

     /**
     * Get a specific reservation found in database
     *
     * @param reservationId - the reservation id
     *
     * @returns An array of type Reservation found in database
     */
    async findReservation(reservationId:number){
        const reservation = await this.reservationRepository.findOne({
                where: { idReservacion:reservationId },
                relations: {
                    user: true,
                    book: true
                },
                select: {                
                    user: {
                        nombre: true,
                        apellidoPaterno: true,
                        apellidoMaterno: true,
                        correoElectronico: true
                    },
                    book: {
                        nombre: true,
                        editorial: true,
                        genero: true,
                        totalPaginas: true
                    }
                },
        });
        if(!reservation){
            throw new HttpException(`Specified reservation ${reservationId} was not found`, HttpStatus.NOT_FOUND)
        }
        return reservation;        
    }

    /**
     * Create a new reservation in database
     *
     * @param newReservation - Reservation object to be inserted in database
     *
     * @returns Reservation created
     */
    async createReservation(newReservation: ReservationDto) {   
        const book = await this.bookService.findBook(newReservation.idLibro);
        if(!book){            
            throw new HttpException(`Specified book id ${newReservation.idLibro} was not found`, HttpStatus.NOT_FOUND)
        }

        const user = await this.userService.findUser(newReservation.idUsuario);
        if(!user){
            throw new HttpException(`Specified user id ${newReservation.idUsuario} was not found`, HttpStatus.NOT_FOUND)
        }
        
        return await this.reservationRepository.save(newReservation);
              
    }   

    /**
     * Update information of an existing reservation in database
     *
     * @param reservationId - Reservation id to be updated
     * @param newReservation - Reservation object to be updated in database
     *
     * @returns Reservation updated
     */
    async updateReservation(reservationId: number, newReservation: ReservationDto) {      
        let toUpdate = await this.reservationRepository.findOne({where: { idReservacion:reservationId }}); 
        if(!toUpdate){
            throw new HttpException(`Specified reservation id ${reservationId} was not found`, HttpStatus.NOT_FOUND)
        }
        let updated = Object.assign(toUpdate, newReservation); 
        return this.reservationRepository.save(updated);
    }

    /**
     * Delete an existing reservation in database
     *
     * @param reservationId - Reservation id to be deleted
     *
     * @returns response confirmation
     */
    async deleteReservation(reservationId: number) {
        let toDelete = await this.reservationRepository.findOne({where: { idReservacion:reservationId }});
        if(!toDelete){
            throw new HttpException(`Specified reservation id ${reservationId} was not found`, HttpStatus.NOT_FOUND)
        }
        return this.reservationRepository.delete({ idReservacion : reservationId });
    }

}
