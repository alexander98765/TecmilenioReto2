import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './../../../src/reservation/reservation.service';
import { ReservationController } from './../../../src/reservation/reservation.controller';
import { Reservation } from './../../../src/reservation/entity/reservation.entity';
import { Book } from './../../../src/book/entity/book.entity';
import { User } from './../../../src/user/entity/user.entity';

describe('Reservation Controller', () => {
    let controller: ReservationController;

    let book = new Book(1, "Lobo estepario", "420", "Alianza", new Date("1935-05-20"), "Novela", "Desripcion de prueba lobo estepario")
    let user = new User(1, "Alejandro", "Perez", "Morales", 30, "alex@gmail.com", "Administrador", true, "Alex321");
    
    let mockReservation:Reservation = {
        idReservacion: 1,
        idLibro: 1,
        idUsuario: 1,
        book: book,
        user: user,
        fechaReservacion: new Date("2024-05-20"),
        fechaDevolucion: new Date("2024-06-20"),
        folioReservacion: "202405201750WE21",
        estatusReservacion: "Activa"
    }

    let mockReservationService = {
        findAll: jest.fn(),
        findReservation: jest.fn(),
        updateReservation: jest.fn((idReservacion, dto) => {
            return Promise.resolve({
              ...dto,
            });
        }),
        createReservation: jest.fn((dto) => {        
            return dto;
        }),
        deleteReservation: jest.fn().mockImplementation((idReservacion) => { 
            return Promise.resolve({
              raw: [],
              affected: 1,
            });
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [ReservationController],
          providers: [ReservationService],
        })
          .overrideProvider(ReservationService) 
          .useValue(mockReservationService) 
          .compile(); 
    
        controller = module.get<ReservationController>(ReservationController);
    });

    it('Reservation controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('ReservationController CRUD operations', () => {
        
        it('Should create a new reservation', async () => {
            const createReservationDto:Reservation = {
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 1,
                book: book,
                user: user,
                fechaReservacion: new Date("2024-05-20"),
                fechaDevolucion: new Date("2024-06-20"),
                folioReservacion: "202405201750WE22",
                estatusReservacion: "Activa"
            }          
                
            expect(await controller.createReservation(createReservationDto)).toStrictEqual({
                idReservacion: createReservationDto.idReservacion,
                idLibro: createReservationDto.idLibro,
                idUsuario: createReservationDto.idUsuario,
                book: createReservationDto.book,
                user: createReservationDto.user,
                fechaReservacion: createReservationDto.fechaReservacion,
                fechaDevolucion: createReservationDto.fechaDevolucion,
                folioReservacion: expect.any(String),
                estatusReservacion: createReservationDto.estatusReservacion
            });
        });

        it('Should update a reservation', async () => {
            const updateReservationDto:Reservation = {
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 1,
                book: book,
                user: user,
                fechaReservacion: new Date("2024-05-20"),
                fechaDevolucion: new Date("2024-06-20"),
                folioReservacion: "202405201750WE22",
                estatusReservacion: "En proceso"
            } 
    
          const idToUpdate = 1; 
          jest.spyOn(mockReservationService, 'findReservation').mockReturnValue(mockReservation);
    
          const result = await controller.updateReservation(idToUpdate, updateReservationDto);

          expect(result).toEqual({ 
            idReservacion: updateReservationDto.idReservacion,
            idLibro: updateReservationDto.idLibro,
            idUsuario: updateReservationDto.idUsuario,
            book: updateReservationDto.book,
            user: updateReservationDto.user,
            fechaReservacion: updateReservationDto.fechaReservacion,
            fechaDevolucion: updateReservationDto.fechaDevolucion,
            folioReservacion: expect.any(String),
            estatusReservacion: updateReservationDto.estatusReservacion       
        });
        expect(mockReservationService.updateReservation).toHaveBeenCalled();
    
        });

        it('Should find all reservations', async () => { 
            jest.spyOn(mockReservationService, 'findAll').mockReturnValue(mockReservation);
            let response = await controller.findAll();
            expect(response).toEqual(mockReservation);
            expect(mockReservationService.findAll).toHaveBeenCalled();
        });

        it('Should find a reservation by id', async () => { 
            const reservationIdToFind = 1;      
      
            jest.spyOn(mockReservationService, 'findReservation').mockReturnValue(mockReservation);
      
            const result = await controller.findReservation(reservationIdToFind);
            expect(result).toEqual(mockReservation);
            expect(mockReservationService.findReservation).toHaveBeenCalled();
      
        });

        it('Should delete a reservation', async () => {       
            const idDelete = 1;
            jest.spyOn(mockReservationService, 'deleteReservation').mockReturnValue(mockReservation);
            const result = await controller.deleteReservation(idDelete);
            expect(result).toEqual(mockReservation);
            expect(mockReservationService.deleteReservation).toHaveBeenCalled();
        });
                
    });

});