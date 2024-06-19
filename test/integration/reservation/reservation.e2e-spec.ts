import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BookService } from '../../../src/book/book.service';
import { Book } from '../../../src/book/entity/book.entity';
import { Author } from '../../../src/author/entity/author.entity';
import { User } from '../../../src/user/entity/user.entity';
import { Reservation } from '../../../src/reservation/entity/reservation.entity';
import { AuthorService } from '../../../src/author/author.service';
import { ReservationService } from '../../../src/reservation/reservation.service';
import { UserService } from '../../../src/user/user.service';
import { AppModule } from '../../../src/app.module';
import { JwtStrategy } from '../../../src/auth/jwt.strategy';
import { getRepositoryToken } from '@nestjs/typeorm';
import supertest, * as request from 'supertest';

describe('ReservationController (e2e)', () => {
    let app: INestApplication;
    let token:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZXhQZXJleiIsInBlcmZpbCI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MTg0NjE0ODEsImV4cCI6MTcxODUwNDY4MX0.XL06tyz_fC0ZHKAArAyUNCh5MOLvVhvMmn79hAGF4LU";

    let authorHH = new Author(1,'Hermann','Hesse','',new Date("1942-08-22"))
    let user = new User(1, "Alejandro", "Perez", "Morales", "20", "alex@gmail.com", "Administrador", true, "Alex123")
    let book = new Book(1, "Lobo estepario", "420", "Alianza", new Date("1935-05-20"), "Novela", "Desripcion de prueba lobo estepario")

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
        edad: '20',
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
        book: book,
        user: user,
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

    const emptyMock = null;

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
        const moduleFixture: TestingModule = await Test.createTestingModule({            
            imports:[AppModule],
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
                }
              ],
          })
            /*.overrideGuard(JwtStrategy)
            .useValue({ canActivate: () => true })*/
            .overrideGuard(JwtStrategy)
            .useValue({ canActivate: () => true })
            .overrideProvider(getRepositoryToken(Reservation)) 
            .useValue(mockReservationRepository)
            .overrideProvider(getRepositoryToken(User)) 
            .useValue(mockUserRepository)
            .overrideProvider(getRepositoryToken(Book)) 
            .useValue(mockBookRepository) 
            .overrideProvider(getRepositoryToken(Author)) 
            .useValue(mockAuthorRepository) 
            .compile();
      
          app = moduleFixture.createNestApplication();
          await app.init();
    });

    describe('ReservationController (e2e), CRUD operations', () => {

        it('/reservation (GET) get all reservations', async () => {
      
            jest.spyOn(mockReservationRepository, 'find').mockReturnValue(mockReservation);
      
            let res = await request(app.getHttpServer())
            .get('/reservation')
            .set('Authorization', `Bearer ${token}`);
      
            /*expect(res.body).toStrictEqual({
                idLibro: expect.any(Number),
                nombre: mockBook.nombre,
                totalPaginas: mockBook.totalPaginas,
                editorial: mockBook.editorial,
                fechaPublicacion: expect.any(String),
                genero: mockBook.genero,
                descripcion: mockBook.descripcion,
                author: {
                    idAutor: mockBook.author.idAutor,
                    nombre: mockBook.author.nombre,
                    apellidoPaterno: mockBook.author.apellidoPaterno,
                    apellidoMaterno: mockBook.author.apellidoMaterno,
                    fechaNacimiento: expect.any(String)
                },
                idAutor: mockBook.idAutor,
                users: []
            });*/
            expect(res.body).toEqual({
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 1,
                book: {
                    idLibro: mockBook.idLibro,                    
                    nombre: mockBook.nombre,
                    totalPaginas: mockBook.totalPaginas,
                    editorial: mockBook.editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockBook.genero,
                    descripcion: mockBook.descripcion,
                    /*idAutor: mockBook.idAutor,
                    author: {                        
                        idAutor: mockAuthor.idAutor,
                        nombre: mockAuthor.nombre,
                        apellidoPaterno: mockAuthor.apellidoPaterno,
                        apellidoMaterno: mockAuthor.apellidoMaterno,
                        fechaNacimiento: expect.any(String),
                        books: [
                            {
                                idLibro: mockBook.idLibro,
                                nombre: mockBook.nombre, 
                                totalPaginas: mockBook.totalPaginas,
                                editorial: mockBook.editorial,
                                fechaPublicacion: expect.any(String),
                                genero: mockBook.genero,
                                descripcion: mockBook.descripcion
                            }
                        ]
                    },
                    users: []*/
                },
                user: {
                    idUsuario: mockUser.idUsuario,
                    nombre: mockUser.nombre,
                    apellidoPaterno: mockUser.apellidoPaterno,
                    apellidoMaterno: mockUser.apellidoMaterno,
                    edad: mockUser.edad,
                    correoElectronico: mockUser.correoElectronico,
                    perfil: mockUser.perfil,
                    activo: mockUser.activo,
                    //fechaAlta: expect.any(String),
                    nombreUsuario: mockUser.nombreUsuario,
                    //contrasena: mockUser.contrasena,
                    //books: []
                },
                fechaReservacion: expect.any(String),
                fechaDevolucion: expect.any(String),
                folioReservacion: "202405201750WE21",
                estatusReservacion: "Activa"
            });
            expect(res.statusCode).toBe(200);          
        });

        it('/reservation/id (GET) get reservation by id', async () => {
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
            
            let reservationId = 1;
    
            const response = await request(app.getHttpServer())
              .get('/reservation/'+ reservationId)
              .set('Authorization', `Bearer ${token}`);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 1,
                book: {
                    idLibro: mockBook.idLibro,                    
                    nombre: mockBook.nombre,
                    totalPaginas: mockBook.totalPaginas,
                    editorial: mockBook.editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockBook.genero,
                    descripcion: mockBook.descripcion,                    
                },
                user: {
                    idUsuario: mockUser.idUsuario,
                    nombre: mockUser.nombre,
                    apellidoPaterno: mockUser.apellidoPaterno,
                    apellidoMaterno: mockUser.apellidoMaterno,
                    edad: mockUser.edad,
                    correoElectronico: mockUser.correoElectronico,
                    perfil: mockUser.perfil,
                    activo: mockUser.activo,                
                    nombreUsuario: mockUser.nombreUsuario,
                },
                fechaReservacion: expect.any(String),
                fechaDevolucion: expect.any(String),
                folioReservacion: "202405201750WE21",
                estatusReservacion: "Activa"
            });
        });

        it('/reservation (POST) create new reservation', async () => {
    
            let mockLocalReservation:Reservation = {
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
            
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
            jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);            
    
            const response = await request(app.getHttpServer())
                .post('/reservation')
                .send(mockLocalReservation)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.statusCode).toBe(201);
            expect(response.body).toStrictEqual({
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 1,
                book: {
                    idLibro: mockBook.idLibro,                    
                    nombre: mockBook.nombre,
                    totalPaginas: mockBook.totalPaginas,
                    editorial: mockBook.editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockBook.genero,
                    descripcion: mockBook.descripcion,                    
                },
                user: {
                    idUsuario: mockUser.idUsuario,
                    nombre: mockUser.nombre,
                    apellidoPaterno: mockUser.apellidoPaterno,
                    apellidoMaterno: mockUser.apellidoMaterno,
                    edad: mockUser.edad,
                    correoElectronico: mockUser.correoElectronico,
                    perfil: mockUser.perfil,
                    activo: mockUser.activo,                
                    nombreUsuario: mockUser.nombreUsuario,
                },
                fechaReservacion: expect.any(String),
                fechaDevolucion: expect.any(String),
                folioReservacion: "202405201750WE21",
                estatusReservacion: "Activa"
            });
      
        });

        it('/reservation/id (PUT) update reservation', async () => {
            let idUToUpdate = 1;    

            let mockLocalReservation:Reservation = {
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
      
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
            jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);

            const response = await request(app.getHttpServer())
                .put('/reservation/'+ idUToUpdate)
                .send(mockLocalReservation)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 1,
                book: {
                    idLibro: mockBook.idLibro,                    
                    nombre: mockBook.nombre,
                    totalPaginas: mockBook.totalPaginas,
                    editorial: mockBook.editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockBook.genero,
                    descripcion: mockBook.descripcion,                    
                },
                user: {
                    idUsuario: mockUser.idUsuario,
                    nombre: mockUser.nombre,
                    apellidoPaterno: mockUser.apellidoPaterno,
                    apellidoMaterno: mockUser.apellidoMaterno,
                    edad: mockUser.edad,
                    correoElectronico: mockUser.correoElectronico,
                    perfil: mockUser.perfil,
                    activo: mockUser.activo,                
                    nombreUsuario: mockUser.nombreUsuario,
                },
                fechaReservacion: expect.any(String),
                fechaDevolucion: expect.any(String),
                folioReservacion: "202405201750WE21",
                estatusReservacion: "Activa"
            });
        });

        it('/reservation/id (DELETE) delete reservation', async () => {
            let idToDelete = 1;
            const response = await request(app.getHttpServer())
                .delete('/reservation/'+ idToDelete)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
        });

    });

    describe('ReservationController (e2e), extra uses cases', () => {

        it('/reservation (GET), no reservation in database, should show exception', async () => {
            jest.spyOn(mockReservationRepository, 'find').mockReturnValue(emptyMock);
            const response = request(app.getHttpServer())
                .get('/reservation')
                .set('Authorization', `Bearer ${token}`);
            
            response.expect(500);        
        });

        it('/reservation/id (DELETE), Should not delete a reservation when user id does not exist', async () => {
            let idToDelete = 16;
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .delete('/reservation/'+ idToDelete)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);
        });

        it('/reservation/id (GET) should not get a reservation that does not exist', async () => {
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(emptyMock);
            let reservationId = 100;
            const response = await request(app.getHttpServer())
                .get('/reservation/'+ reservationId)
                .set('Authorization', `Bearer ${token}`);
                
            

            expect(response.statusCode).toBe(400);
        });

        it('/reservation/id (PUT) Should not update reservation that does not exits', async () => {
            let idUToUpdate = 100;    
            let mockLocalReservation:Reservation = {
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
      
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .put('/reservation/'+ idUToUpdate)
                .send(mockLocalReservation)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);      
        });

        it('/reservation/id (PUT) Should not update reservation where user id does not exits', async () => {
            let idUToUpdate = 100;    
            let mockLocalReservation:Reservation = {
                idReservacion: 1,
                idLibro: 1,
                idUsuario: 100,
                book: book,
                user: user,
                fechaReservacion: new Date("2024-05-20"),
                fechaDevolucion: new Date("2024-06-20"),
                folioReservacion: "202405201750WE21",
                estatusReservacion: "Activa"
            }
      
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
            jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(emptyMock);
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
            const response = await request(app.getHttpServer())
                .put('/reservation/'+ idUToUpdate)
                .send(mockLocalReservation)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);      
        });

        it('/reservation/id (PUT) Should not update reservation where book id does not exits', async () => {
            let idUToUpdate = 1;    
            let mockLocalReservation:Reservation = {
                idReservacion: 1,
                idLibro: 100,
                idUsuario: 1,
                book: book,
                user: user,
                fechaReservacion: new Date("2024-05-20"),
                fechaDevolucion: new Date("2024-06-20"),
                folioReservacion: "202405201750WE21",
                estatusReservacion: "Activa"
            }
      
            jest.spyOn(mockReservationRepository, 'findOne').mockReturnValue(mockReservation);
            jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .put('/reservation/'+ idUToUpdate)
                .send(mockLocalReservation)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(400);      
        });

    });

});