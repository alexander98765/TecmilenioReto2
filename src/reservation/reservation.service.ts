import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Reservation } from './entity/reservation.entity'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm'; 
import { ReservationDto } from './dto/reservation.dto'
import { UserService } from '../user/user.service';
import { BookService } from '../book/book.service';
import { Estatus } from './estatus.enum';

 /**
     * Layer to make all reservations operations in database
 */
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
     * Get all reservations found in database
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
        if(reservations == null){
        //if(reservations.length == 0){
            throw new HttpException(`No reservations were found in database`, HttpStatus.NOT_FOUND)
        }
        return reservations;        
    }

     /**
     * Get a specific reservation found in database
     *
     * @param reservationId - the reservation id
     * 
     * @remarks
     * Fields are filtered to show only important fields from each related table
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
     * Get a specific reservation found in database by folioReservacion
     *
     * @param folioReservacion - the reservation ID
     *
     * @remarks
     * Fields are filtered to show only important fields from each related table
     * 
     * @returns An array of type Reservation found in database
     */
    async findReservationByFolioReservacion(folioReservacion:string){
        const reservation = await this.reservationRepository.findOne({
                where: { folioReservacion },
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
            throw new HttpException(`Specified reservation by folio reservacion: ${folioReservacion} was not found`, HttpStatus.NOT_FOUND)
        }
        return reservation;        
    }

    /**
     * Create a new reservation in database
     *
     * @remarks
     * This method creates dynamic reservation ID for user to give a following
     * By default, all created reservations have "Activa" status
     * This method validates if book and user exists before inserting record.
     * 
     * @param newReservation - Reservation object to be inserted in database
     *
     * @returns Reservation created
     */
    async createReservation(newReservation: ReservationDto) {   

        let folioReservacion:string;
        let estatusReservacion:string;

        const book = await this.bookService.findBook(newReservation.idLibro);
        if(!book){            
            throw new HttpException(`Specified book id ${newReservation.idLibro} was not found`, HttpStatus.NOT_FOUND)
        }

        const user = await this.userService.findUser(newReservation.idUsuario);
        if(!user){
            throw new HttpException(`Specified user id ${newReservation.idUsuario} was not found`, HttpStatus.NOT_FOUND)
        }

        folioReservacion = this.generateFolioReservacion();
        estatusReservacion = Estatus.Activa;        
        const modifiedReservation: ReservationDto = { ...newReservation, folioReservacion: folioReservacion, estatusReservacion: estatusReservacion };
        
        const res = await this.reservationRepository.save(modifiedReservation);
        const created = this.findReservation(res.idReservacion);
        return created;
              
    }   

    /**
     * Update information of an existing reservation in database
     *
     * @param reservationId - Reservation id to be updated
     * @param newReservation - Reservation object to be updated in database
     * 
     * @remarks
     * This method validates if the reservations exists, if not, an exception is thrown.
     * This method validates if the indicated book exist, if not, an exception is thrown.
     * This method validates if the indicated user exist, if not, an exception is thrown.
     *
     * @returns Reservation updated
     */
    async updateReservation(reservationId: number, newReservation: ReservationDto) {      
        let toUpdate = await this.reservationRepository.findOne({where: { idReservacion:reservationId }}); 
        if(!toUpdate){
            throw new HttpException(`Specified reservation id ${reservationId} was not found`, HttpStatus.NOT_FOUND)
        }
        const book = await this.bookService.findBook(newReservation.idLibro);
        if(!book){            
            throw new HttpException(`Specified book id ${newReservation.idLibro} was not found`, HttpStatus.NOT_FOUND)
        }
        const user = await this.userService.findUser(newReservation.idUsuario);
        if(!user){
            throw new HttpException(`Specified user id ${newReservation.idUsuario} was not found`, HttpStatus.NOT_FOUND)
        }
        let updated = Object.assign(toUpdate, newReservation); 
        return this.reservationRepository.save(updated);
    }

    /**
     * Delete an existing reservation in database
     *
     * @param reservationId - Reservation id to be deleted
     * 
     * @remarks 
     * This method validates if reservation exists, if not an exception is thrown.
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

    /**
     * Create "folioReservacion" 
     * 
     * @remarks 
     * This method creates a random folio reservacion for each Reservation made.
     *
     * @returns folio - Created folio
     */
    generateFolioReservacion(){
        let folio: string;
        folio = Math.random().toString(16).slice(2);
        return folio;
    }

}
