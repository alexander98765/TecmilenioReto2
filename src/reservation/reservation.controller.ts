import { Controller, Post, Body, Get, Param, Put, Delete, HttpException, HttpStatus, UseFilters, BadRequestException } from '@nestjs/common';
import { ReservationDto } from './reservation.dto'
import { Reservation } from './reservation.entity'
import { ReservationService } from './reservation.service'
import { HttpExceptionFilter } from '../filters/HttpExceptionFilter'

@Controller('reservation')
export class ReservationController {
    constructor(private reservationService : ReservationService){}

    /**
     * 
     * /biblioteca/reservation:
     * get:
     *      summary: Get all reservations registered in database
     *      tags: [Reservation]
     *      responses: 
     *          200: 
     *              description: get all reservations 
     *          404:
     *              description: reservations were not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get()
    async findAll(){
        try{
            return await this.reservationService.findAll();
        }catch(ex){
            throw new HttpException("Error fetching reservations " + ex, HttpStatus.BAD_REQUEST)            
        }        
    }

    /**
     * 
     * /biblioteca/reservation/{id}:
     * get:
     *      summary: Get a specific reservation registered in database by id
     *      tags: [Reservation]
     *      responses: 
     *          200: 
     *              description: get reservation found by id
     *          404:
     *              description: reservation was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Get(':reservationId')
    async findReservation(@Param('reservationId') reservationId: number){
        try{
            return await this.reservationService.findReservation(reservationId)
        }catch(ex){
            throw new HttpException(`Error while fetching the reservation: ${ex}` + ex, HttpStatus.BAD_REQUEST)                        
        }        
    }

     /**
     * 
     * /biblioteca/reservation:
     * post:
     *      summary: Create a new reservation in database
     *      tags: [Reservation]
     *      responses: 
     *          200: 
     *              description: reservation was created in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Post()
    async createReservation(@Body() newReservation: ReservationDto){
        try{           
            return await this.reservationService.createReservation(newReservation);
        }catch(ex){
            throw new HttpException("Error " + ex, HttpStatus.BAD_REQUEST)
        }
    }

    /**
     * 
     * /biblioteca/reservation/{id}:
     * put:
     *      summary: Update information from a specific reservation in database by id
     *      tags: [Reservation]
     *      responses: 
     *          200: 
     *              description: reservation with specified id was updated in database
     *          404:
     *              description: reservation was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Put(':reservationId')
    async updateReservation(
        @Param('reservationId') reservationId: number,
        @Body() newReservation: ReservationDto, 
    ) {
        try{
            return await this.reservationService.updateReservation(reservationId, newReservation);
        }catch(ex){
            throw new HttpException("Error updating reservation " + ex, HttpStatus.BAD_REQUEST)
        }        
    }

    /**
     * 
     * /biblioteca/reservation/{id}:
     * delete:
     *      summary: Delete a specific reservation in database by id
     *      tags: [Reservation]
     *      responses: 
     *          200: 
     *              description: reservation with specified id was deleted from database
     *          404:
     *              description: reservation was not found in database
     *          500: 
     *              description: error in server side
     *  
     */
    @Delete(':reservationId') 
    async deleteReservation(@Param('reservationId') reservationId: number) { 
        try{
            return await this.reservationService.deleteReservation(reservationId); 
        }catch(ex){
            throw new HttpException("Error deleting reservation " + ex, HttpStatus.BAD_REQUEST)
        }           
    }

}
