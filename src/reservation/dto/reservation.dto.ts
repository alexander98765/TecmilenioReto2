import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsInt, IsNotEmpty } from 'class-validator';

/**
  * Represents a Reservation DTO to create and update records
  * @public
*/
export class ReservationDto {

  /**
      * Foreign key from book entity
      * @readonly
      * @public
  */
  @ApiProperty({
    example: 15,
    required: true
  })
  @IsNotEmpty()
  @IsInt()
  readonly idLibro: number;
   
  /**
      * Foreign key from user entity
      * @readonly
      * @public
  */
  @ApiProperty({
    example: 6,
    required: true
  })
  @IsNotEmpty()
  @IsInt()
  readonly idUsuario: number;

  /**
      * Date when reservation was made. Automatic date
      * @readonly
      * @public
  */
  readonly fechaReservacion: Date;

  /**
      * Date when book should be given back to library
      * @readonly
      * @public
  */
  @ApiProperty({
    example: '2024-06-23',
    required: true
  })
  @IsNotEmpty()
  @IsISO8601()
  readonly fechaDevolucion: Date;
  
  /**
      * Folio for user to give a following of the reservation
      * @readonly
      * @public
  */
  readonly folioReservacion: string;

  /**
      * Current reservation status.
      * @readonly
      * @public
  */
  readonly estatusReservacion: string;

  }