import { Controller, Post, Body, Get, Param, Put, Delete, HttpException, HttpStatus, UseFilters, UseGuards } from '@nestjs/common';
import { ReservationDto } from './dto/reservation.dto'
import { Reservation } from './entity/reservation.entity'
import { ReservationService } from './reservation.service'
import { HttpExceptionFilter } from '../filters/HttpExceptionFilter'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HasRoles } from '../auth/has-roles.decorator';
import { Role } from '../user/role.enum';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

/**
 * Represents a class to expose Reservation endpoints
 * 
 * @remarks
 * Endpoints can be found using prefix "reservation"
 * Endpoints use rate limiting
 * 
 * @public
 */
@SkipThrottle({ default: false })
@Controller('reservation')
export class ReservationController {

    /**
    * @param reservationService - Insntace of reservation service to make operations in database.
    * @private
    */
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
     *          401:
     *              description: User does not have enough permissions to execute this endpoint.
     *          403:
     *              description: Forbidden, user does not have enough permissions.
     *          404:
     *              description: reservations were not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get all reservations registered in database.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Reservations were not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get all reservations registered in database. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Reservation')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          401:
     *              description: User does not have enough permissions to execute this endpoint.
     *          403:
     *              description: Forbidden, user does not have enough permissions.
     *          404:
     *              description: reservation was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific reservation registered in database by id.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Reservation was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific reservation registered in database by id. ONLY users with "Administrador" and "Usuario" role are able to execute this endpoint' })
    @ApiTags('Reservation')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador, Role.Usuario)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     * /biblioteca/reservation/folio/{folioReservacion}:
     * get:
     *      summary: Get a specific reservation registered in database by folioReservacion
     *      tags: [Reservation]
     *      responses: 
     *          200: 
     *              description: get reservation found by folioReservacion
     *          401:
     *              description: User does not have enough permissions to execute this endpoint.
     *          403:
     *              description: Forbidden, user does not have enough permissions.
     *          404:
     *              description: reservation was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Get specific reservation registered in database by folioReservacion.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Reservation was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Get specific reservation registered in database by folioReservacion. ONLY users with "Administrador" and "Usuario" role are able to execute this endpoint' })
    @ApiTags('Reservation')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador, Role.Usuario)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Get('/folio/:folioReservacion')
    async findReservationByFolioReservacion(@Param('folioReservacion') folioReservacion: string){
        try{
                console.log("folioReservacion " + folioReservacion)
            return await this.reservationService.findReservationByFolioReservacion(folioReservacion)
        }catch(ex){
            throw new HttpException(`Error while fetching the reservation by folio reservacion: ${ex}` + ex, HttpStatus.BAD_REQUEST)                        
        }        
    }

     /**
     * 
     * /biblioteca/reservation:
     * post:
     *      summary: Create a new reservation in database
     *      tags: [Reservation]
     *      responses: 
     *          201: 
     *              description: reservation was created in database
     *          400: 
     *              description: Bad request.
     *          401: 
     *              description: User does not have enough permissions to execute this endpoint.
     *          403: 
     *              description: Forbidden, user does not have enough permissions.
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
     @ApiResponse({ status: 201, description: 'New reservation registered in database.'})
     @ApiResponse({ status: 400, description: 'Bad request.'})
     @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
     @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
     @ApiResponse({ status: 429, description: 'Too many request.'})
     @ApiResponse({ status: 500, description: 'Server side error.'})
     @ApiOperation({ summary: 'Insert a new reservation in database. ONLY users with "Administrador" and "Usuario" roles are able to execute this endpoint' })
     @ApiBody({
        type: Reservation,
        description: 'Insert a new reservation in database',
     })
    @ApiTags('Reservation')
    @ApiBearerAuth()
    @Throttle( { default: { ttl: 30000, limit: 3 } })
    @HasRoles(Role.Administrador, Role.Usuario)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          401:
     *              description: User does not have enough permissions to execute this endpoint.
     *          403:
     *              description: Forbidden, user does not have enough permissions.
     *          404:
     *              description: reservation was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Reservation updated correctly.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Reservation to update was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Update specific reservation registered in database by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Reservation')
    @ApiBearerAuth()
    @Throttle( { default: { ttl: 30000, limit: 3 } })
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
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
     *          400:
     *              description: Bad request.
     *          401:
     *              description: User does not have enough permissions to execute this endpoint.
     *          403:
     *              description: Forbidden, user does not have enough permissions.
     *          404:
     *              description: reservation was not found in database
     *          429:
     *              description: Too many request
     *          500: 
     *              description: Server side error
     *  
     */
    @ApiResponse({ status: 200, description: 'Reservation deleted correctly.'})
    @ApiResponse({ status: 400, description: 'Bad request.'})
    @ApiResponse({ status: 401, description: 'User does not have enough permissions to execute this endpoint.'})
    @ApiResponse({ status: 404, description: 'Reservation to delete was not found in database.'})
    @ApiResponse({ status: 403, description: 'Forbidden, user does not have enough permissions.'})
    @ApiResponse({ status: 429, description: 'Too many request.'})
    @ApiResponse({ status: 500, description: 'Server side error.'})
    @ApiOperation({ summary: 'Delete a reservation from database (hard delete) by id. ONLY users with "Administrador" role are able to execute this endpoint' })
    @ApiTags('Reservation')
    @ApiBearerAuth()
    @HasRoles(Role.Administrador)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Delete(':reservationId') 
    async deleteReservation(@Param('reservationId') reservationId: number) { 
        try{
            return await this.reservationService.deleteReservation(reservationId); 
        }catch(ex){
            throw new HttpException("Error deleting reservation " + ex, HttpStatus.BAD_REQUEST)
        }           
    }

}
