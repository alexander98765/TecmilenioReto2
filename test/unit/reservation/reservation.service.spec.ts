import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './../../../src/book/book.service';
import { AuthorService } from './../../../src/author/author.service';
import { UserService } from './../../../src/user/user.service';
import { ReservationService } from './../../../src/reservation/reservation.service';
import { Book } from './../../../src/book/entity/book.entity';
import { Reservation } from './../../../src/reservation/entity/reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { response } from 'express';
import { Author } from './../../../src/author/entity/author.entity';
import { User } from './../../../src/user/entity/user.entity';

describe('ReservationService', () => {
  let service: ReservationService;

  let authorHH = new Author(1,'Hermann','Hesse','',new Date("1942-08-22"))
  
  let mockBook:Book = {
    idLibro: 1,
    nombre: 'Lobo estepario',
    totalPaginas: '420',
    editorial: 'Alianza',
    fechaPublicacion: new Date("1935-05-20"),
    genero: "Novela",
    descripcion: "Desripcion de prueba lobo estepario",
    idAutor: 1,
    author: authorHH,
    users: []
  }

  let mockUser:User = {
    idUsuario: 1,
    nombre: 'Alejandro',
    apellidoPaterno: 'Perez',
    apellidoMaterno: 'Morales',
    edad: '10',
    correoElectronico: 'alex@gmail.com',
    perfil: 'Administrador',
    activo: true,
    fechaAlta: new Date("2021-02-02"),
    nombreUsuario: 'Alex123',
    contrasena: 'wewewe#$#$"#"FDFDET&%&$',
    books: []
    }

  let mockReservation:Reservation = {
    idReservacion: 1,
    idLibro: 1,
    idUsuario: 1,
    book: mockBook,
    user: mockUser,
    fechaReservacion: new Date("2024-05-20"),
    fechaDevolucion: new Date("2024-06-20"),
    folioReservacion: "202405201750WE21",
    estatusReservacion: "Activa"
  }

  let mockAuthor = {
    idAutor: 1,
    nombre: 'Milan',
    apellidoPaterno: 'Kundera',
    apellidoMaterno: '',
    fechaNacimiento: new Date("1935-05-20"),
    books: [
        {
            idLibro: 10,
            nombre: "La insoportable levedad del ser", 
            totalPaginas: "320",
            editorial: "Tusquets",
            fechaPublicacion: new Date("1984-05-24"),
            genero: "Novela",
            descripcion: "Libro de prueba"
        }
    ]
    }

  let emptyMock = null;

  let mockReservationRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn((dto) => {
        return Promise.resolve({
          idLibro: Math.random() * (1000 - 1) + 1,
          ...dto,
        });
    }),
    create: jest.fn((dto) => {        
        return dto;
    }),
    delete: jest.fn().mockImplementation((idLibro) => { 
        return Promise.resolve({
          raw: [],
          affected: 1,
        });
    })
  };
  let mockBookRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn((dto) => {
        return Promise.resolve({
          idLibro: Math.random() * (1000 - 1) + 1,
          ...dto,
        });
    }),
    create: jest.fn((dto) => {        
        return dto;
    }),
    delete: jest.fn().mockImplementation((idLibro) => { 
        return Promise.resolve({
          raw: [],
          affected: 1,
        });
    })
  };

  let mockAuthorRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn((dto) => {
        return Promise.resolve({
          idAutor: Math.random() * (1000 - 1) + 1,
          ...dto,
        });
    }),
    delete: jest.fn().mockImplementation((idAuthor) => { 
        return Promise.resolve({
          raw: [],
          affected: 1,
        });
    })
  };
  let mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn((dto) => {
        return Promise.resolve({
          idUsuario: Math.random() * (1000 - 1) + 1,
          ...dto,
        });
    }),
    delete: jest.fn().mockImplementation((idUsuario) => { 
        return Promise.resolve({
          raw: [],
          affected: 1,
        });
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        ReservationService,
        AuthorService,
        UserService,
        { 
          provide: getRepositoryToken(Reservation), 
          useValue: mockReservationRepository, 
        },
        { 
            provide: getRepositoryToken(Book), 
            useValue: mockBookRepository, 
        },
        { 
            provide: getRepositoryToken(Author), 
            useValue: mockAuthorRepository, 
        },
        { 
            provide: getRepositoryToken(User), 
            useValue: mockUserRepository, 
        },
      ],
    }).compile(); 

    service = module.get<ReservationService>(ReservationService);
  });

  it('Reservation service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ReservationService CRUD operations', () => {

    it('Should find all reservations', async () => { 
      jest.spyOn(mockReservationRepository, 'find').mockReturnValue(mockReservation);
      let response = await service.findAll();
      expect(response).toEqual(mockReservation);
      expect(mockReservationRepository.find).toHaveBeenCalled();
    });

    it('Should find a reservation by id', async () => { 
      const reservationIdToFind = 1;      

      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);

      const result = await service.findReservation(reservationIdToFind);
      expect(result).toEqual(mockReservation);
      expect(mockReservationRepository.findOne).toHaveBeenCalled();

    });

   it('Should create a new reservation', async () => {
    const createReservationDto:Reservation = {
        idReservacion: 1,
        idLibro: 1,
        idUsuario: 1,
        book: mockBook,
        user: mockUser,
        fechaReservacion: new Date("2024-05-20"),
        fechaDevolucion: new Date("2024-06-20"),
        folioReservacion: "202405201750WE22",
        estatusReservacion: "Activa"
      }          

      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
      expect(await service.createReservation(createReservationDto)).toStrictEqual({
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
            book: mockBook,
            user: mockUser,
            fechaReservacion: new Date("2024-05-20"),
            fechaDevolucion: new Date("2024-06-20"),
            folioReservacion: "202405201750WE22",
            estatusReservacion: "Activa"
        } 

      const idToUpdate = 1; 
      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);

      const result = await service.updateReservation(idToUpdate, updateReservationDto);

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
    expect(mockReservationRepository.save).toHaveBeenCalled();

    });

    it('Should delete a reservation', async () => {       
      const idDelete = 1;
      jest.spyOn(mockReservationRepository, 'delete').mockReturnValue(mockReservation);
      const result = await service.deleteReservation(idDelete);
      expect(result).toEqual(mockReservation);
      expect(mockReservationRepository.delete).toHaveBeenCalled();
    });

  });

  describe('ReservationService specific use cases', () => {

    it('Should not find the reservation when ID does not exist in DB', async () => { 
      const reservationId = 35;
      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
      expect(await (await service.findReservation(reservationId)).idReservacion).not.toEqual(
        reservationId,
      );      
    });

    it('Should not delete a reservation when reservation id does not exist', async () => {       
      let idNotExist = 25;
      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(emptyMock);
      jest.spyOn(mockReservationRepository, 'delete').mockReturnValue(mockReservation);
      expect(async () => {
        await service.deleteReservation(idNotExist)
      }).rejects.toThrow("Specified reservation id 25 was not found");

    });

    it('Should throw error when there are no books in DB when calling findAll', async () => { 
      jest.spyOn(mockReservationRepository, 'find').mockReturnValue(emptyMock);
      expect(async () => {
        await service.findAll()
      }).rejects.toThrow("No reservations were found in database");
    });

    it('Should not update a reservation when reservation id does not exist', async () => {       
      let idNotExist = 54;
      const updateReservationDto:Reservation = {
        idReservacion: 1,
        idLibro: 1,
        idUsuario: 1,
        book: mockBook,
        user: mockUser,
        fechaReservacion: new Date("2024-05-20"),
        fechaDevolucion: new Date("2024-06-20"),
        folioReservacion: "202405201750WE22",
        estatusReservacion: "Activa"
      } 

      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(emptyMock);
      jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
      const result = await service.updateReservation(idNotExist, updateReservationDto)           
      expect(result.idReservacion).not.toEqual(
        idNotExist,
      );

    }); 

    it('Should not find the reservation when FolioReservacion does not exist in DB', async () => { 
        const folioReservation = "343423DDS";
        jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
        expect(await (await service.findReservationByFolioReservacion(folioReservation)).folioReservacion).not.toEqual(
            folioReservation,
        );      
    });

    it('Should not create the reservation when ID book does not exist in DB', async () => { 
        const bookId = 35;
        const createReservationDto:Reservation = {
            idReservacion: 2,
            idLibro: 100,
            idUsuario: 1,
            book: mockBook,
            user: mockUser,
            fechaReservacion: new Date("2024-05-20"),
            fechaDevolucion: new Date("2024-06-20"),
            folioReservacion: "202405201750WE22",
            estatusReservacion: "Activa"
        } 
        jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
        jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
        jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);        
        expect(async () => {
            await service.createReservation(createReservationDto)
        }).rejects.toThrow("Specified book id 100 was not found");

      });

      it('Should not create the reservation when ID user does not exist in DB', async () => { 
        const userId = 35;
        const createReservationDto:Reservation = {
            idReservacion: 2,
            idLibro: 1,
            idUsuario: 200,
            book: mockBook,
            user: mockUser,
            fechaReservacion: new Date("2024-05-20"),
            fechaDevolucion: new Date("2024-06-20"),
            folioReservacion: "202405201750WE22",
            estatusReservacion: "Activa"
        } 
        jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
        jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(emptyMock);
        jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);        
        expect(async () => {
            await service.createReservation(createReservationDto)
        }).rejects.toThrow("Specified user id 200 was not found");

      });

  });

});