import { User } from '../user/user.entity'
import { Book } from '../book/book.entity'

export class ReservationDto {
    readonly idLibro: number;
    readonly idUsuario: number;
    readonly fechaReservacion: Date;
    readonly fechaDevolucion: Date;
  }