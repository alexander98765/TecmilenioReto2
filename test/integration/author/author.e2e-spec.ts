import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Book } from '../../../src/book/entity/book.entity';
import { Author } from '../../../src/author/entity/author.entity';
import { BookModule } from '../../../src/book/book.module';
import { BookService } from '../../../src/book/book.service';
import { AuthorModule } from '../../../src/author/author.module';
import { AuthorService } from '../../../src/author/author.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtStrategy } from '../../../src/auth/jwt.strategy';
import supertest, * as request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('AuthorController (e2e)', () => {
    let app: INestApplication;
    let token:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZXhQZXJleiIsInBlcmZpbCI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MTg0NjE0ODEsImV4cCI6MTcxODUwNDY4MX0.XL06tyz_fC0ZHKAArAyUNCh5MOLvVhvMmn79hAGF4LU";
    
    const emptyMock = null;

    let book = new Book(1, "Lobo estepario", "420", "Alianza", new Date("1935-05-20"), "Novela", "Desripcion de prueba lobo estepario")
    let authorHH = new Author(1,'Hermann','Hesse','',new Date("1942-08-22"))

    const mockAuthor:Author = {
        idAutor: 1,
        nombre: 'Hermann',
        apellidoPaterno: 'Hesse',
        apellidoMaterno: '',
        fechaNacimiento: new Date("1942-08-12"),
        books: [book]
    };
    
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

    const mockBookRepository = {     
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn((dto) => {
            return dto
            /*return Promise.resolve({
              mimerda: Math.random() * (1000 - 1) + 1,
              ...dto,
            });*/
        }),
        create: jest.fn((dto) => {        
            //return dto;
            return Promise.resolve({
                idLibro: Math.random() * (1000 - 1) + 1,
                ...dto,
              });
        }),
        delete: jest.fn().mockImplementation((idLibro) => { 
          return Promise.resolve({
            raw: [],
            affected: 1,
          });
        })
    };
    
    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({            
            imports:[AppModule, BookModule, AuthorModule],
            providers: [
                AuthorService,
                BookService,
                { 
                  provide: getRepositoryToken(Book), 
                  useValue: mockBookRepository, 
                },
                { 
                    provide: getRepositoryToken(Author), 
                    useValue: mockAuthorRepository, 
                },
              ],
          })
            /*.overrideGuard(JwtStrategy)
            .useValue({ canActivate: () => true })*/
            .overrideGuard(JwtStrategy)
            .useValue({ canActivate: () => true })
            .overrideProvider(getRepositoryToken(Book)) 
            .useValue(mockBookRepository) 
            .overrideProvider(getRepositoryToken(Author)) 
            .useValue(mockAuthorRepository) 
            .compile();
      
          app = moduleFixture.createNestApplication();
          await app.init();

    });

    describe('AuthorController (e2e), CRUD operations', () => {

        it('/author (GET) get all authors', async () => {
      
            jest.spyOn(mockAuthorRepository, 'find').mockReturnValue(mockAuthor);
      
            let res = await request(app.getHttpServer())
            .get('/author')
            .set('Authorization', `Bearer ${token}`);
      
            
            expect(res.body).toStrictEqual({
                idAutor: mockAuthor.idAutor,
                nombre: mockAuthor.nombre,
                apellidoPaterno: mockAuthor.apellidoPaterno,
                apellidoMaterno: mockAuthor.apellidoMaterno,
                fechaNacimiento: expect.any(String),
                books: [{
                    idLibro: expect.any(Number),
                    nombre: mockAuthor.books[0].nombre,
                    totalPaginas: mockAuthor.books[0].totalPaginas,
                    editorial: mockAuthor.books[0].editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockAuthor.books[0].genero,
                    descripcion: mockAuthor.books[0].descripcion,
                }]
            });
            expect(res.statusCode).toBe(200);          
        });

        it('/author/id (GET) get author by id', async () => {
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
            
            let authorId = 1;
    
            const response = await request(app.getHttpServer())
              .get('/author/'+ authorId)
              .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({
                idAutor: mockAuthor.idAutor,
                nombre: mockAuthor.nombre,
                apellidoPaterno: mockAuthor.apellidoPaterno,
                apellidoMaterno: mockAuthor.apellidoMaterno,
                fechaNacimiento: expect.any(String),
                books: [{
                    idLibro: expect.any(Number),
                    nombre: mockAuthor.books[0].nombre,
                    totalPaginas: mockAuthor.books[0].totalPaginas,
                    editorial: mockAuthor.books[0].editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockAuthor.books[0].genero,
                    descripcion: mockAuthor.books[0].descripcion,
                }]
            });
        });

        it('/author (POST) create new author', async () => {
    
            const mockLocalAuthor:Author = {
                idAutor: 1,
                nombre: 'Hermann',
                apellidoPaterno: 'Hesse',
                apellidoMaterno: '',
                fechaNacimiento: new Date("1942-08-12"),
                books: [book]
            };
            
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
            //jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
    
            const response = await request(app.getHttpServer())
                .post('/author')
                .send(mockLocalAuthor)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.statusCode).toBe(201);
            expect(response.body).toStrictEqual({
                idAutor: mockAuthor.idAutor,
                nombre: mockAuthor.nombre,
                apellidoPaterno: mockAuthor.apellidoPaterno,
                apellidoMaterno: mockAuthor.apellidoMaterno,
                fechaNacimiento: expect.any(String),
                books: [{
                    idLibro: expect.any(Number),
                    nombre: mockAuthor.books[0].nombre,
                    totalPaginas: mockAuthor.books[0].totalPaginas,
                    editorial: mockAuthor.books[0].editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockAuthor.books[0].genero,
                    descripcion: mockAuthor.books[0].descripcion,
                }]
            });
      
        });

        it('/author/id (PUT) update author', async () => {
            let idUToUpdate = 1;    
            const mockLocalAuthor:Author = {
                idAutor: 1,
                nombre: 'Hermann',
                apellidoPaterno: 'Hesse',
                apellidoMaterno: '',
                fechaNacimiento: new Date("1942-08-12"),
                books: [book]
            };
      
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
            const response = await request(app.getHttpServer())
                .put('/author/'+ idUToUpdate)
                .send(mockLocalAuthor)
                .set('Authorization', `Bearer ${token}`)
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({
                idAutor: mockAuthor.idAutor,
                nombre: mockAuthor.nombre,
                apellidoPaterno: mockAuthor.apellidoPaterno,
                apellidoMaterno: mockAuthor.apellidoMaterno,
                fechaNacimiento: expect.any(String),
                books: [{
                    idLibro: expect.any(Number),
                    nombre: mockAuthor.books[0].nombre,
                    totalPaginas: mockAuthor.books[0].totalPaginas,
                    editorial: mockAuthor.books[0].editorial,
                    fechaPublicacion: expect.any(String),
                    genero: mockAuthor.books[0].genero,
                    descripcion: mockAuthor.books[0].descripcion,
                }]
            });
        });

        it('/author/id (DELETE) delete author', async () => {
            let idToDelete = 1;
            const response = await request(app.getHttpServer())
                .delete('/author/'+ idToDelete)
                .set('Authorization', `Bearer ${token}`)
            
            expect(response.statusCode).toBe(200);
        });

    });

    describe('AuthorController (e2e), extra uses cases', () => {
        
        it('/author (GET), no authors in database, should show exception', async () => {
            jest.spyOn(mockAuthorRepository, 'find').mockReturnValue(emptyMock);
            const response = request(app.getHttpServer())
                .get('/author')
                .set('Authorization', `Bearer ${token}`)
            
            response.expect(500);        
        });

        it('/author/id (GET) should not get an author that does not exist', async () => {
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(emptyMock);
            let bookId = 100;
            const response = await request(app.getHttpServer())
                .get('/author/'+ bookId)
                .set('Authorization', `Bearer ${token}`)
            
            expect(response.statusCode).toBe(500);
        });

        it('/author/id (DELETE), Should not delete an author when author id does not exist', async () => {
            let idToDelete = 16;
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .delete('/author/'+ idToDelete)
                .set('Authorization', `Bearer ${token}`)

            expect(response.statusCode).toBe(500);
        });

        it('/author/id (PUT) Should not update author that does not exits', async () => {
            let idUToUpdate = 100;    
            let mockLocalAuthor:Author = {
                idAutor: 100,
                nombre: 'Hermann',
                apellidoPaterno: 'Hesse',
                apellidoMaterno: '',
                fechaNacimiento: new Date("1942-08-12"),
                books: [book]
            }
      
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .put('/author/'+ idUToUpdate)
                .send(mockLocalAuthor)
                .set('Authorization', `Bearer ${token}`)
                
            expect(response.statusCode).toBe(500);      
        });

    });

});