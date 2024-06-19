import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { BookModule } from './../../../src/book/book.module';
import { BookService } from './../../../src/book/book.service';
import { Book } from './../../../src/book/entity/book.entity';
import { Author } from './../../../src/author/entity/author.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import supertest, * as request from 'supertest';
import { AuthorModule } from './../../../src/author/author.module';
import { AuthorService } from './../../../src/author/author.service';
import { JwtStrategy } from '../../../src/auth/jwt.strategy';
import { AppModule } from '../../../src/app.module';

describe('BookController (e2e)', () => {
    let app: INestApplication;
    let token:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZXhQZXJleiIsInBlcmZpbCI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MTg0NjE0ODEsImV4cCI6MTcxODUwNDY4MX0.XL06tyz_fC0ZHKAArAyUNCh5MOLvVhvMmn79hAGF4LU";
    
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

    let mockAuthor:Author = {
        idAutor: 1,
        nombre: 'Hermann',
        apellidoPaterno: 'Hesse',
        apellidoMaterno: '',
        fechaNacimiento: new Date("1942-08-22"),
        books: [mockBook]
    }

    const mockBookRepository = {     
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn((dto) => {
            return dto            
        }),
        create: jest.fn((dto) => {                
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

    const emptyMock = null;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({            
            imports:[AppModule, BookModule, AuthorModule],
            providers: [
                BookService,
                AuthorService,
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

    describe('BookController (e2e), CRUD operations', () => {

        it('/book (GET) get all books', async () => {
      
            jest.spyOn(mockBookRepository, 'find').mockReturnValue(mockBook);
      
            let res = await request(app.getHttpServer())
            .get('/book')
            .set('Authorization', `Bearer ${token}`);
      
            expect(res.body).toStrictEqual({
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
            });
            expect(res.statusCode).toBe(200);          
        });


        it('/book/id (GET) get book by id', async () => {
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
            
            let bookId = 1;
    
            const response = await request(app.getHttpServer())
              .get('/book/'+ bookId)
              .set('Authorization', `Bearer ${token}`);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({
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
            });
        });
    
        /*it('/book (POST) create new book', async () => {
    
            let mockLocalBook:Book = {
                idLibro: 1,
                nombre: 'Libro de prueba',
                totalPaginas: '420',
                editorial: 'Alianza',
                fechaPublicacion: new Date("1935-05-20"),
                genero: "Novela",
                descripcion: "Desripcion de prueba lobo estepario",
                idAutor: 1,
                author: authorHH,
                users: []
            }
            
            //jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
            jest.spyOn(mockAuthorRepository, 'find').mockReturnValue(mockAuthor);
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
    
            const response = await request(app.getHttpServer())
                .post('/book')
                .send(mockLocalBook)
                .set('Authorization', `Bearer ${token}`);
    
            console.log("guardar book")
            console.log(response.body)
    
            expect(response.statusCode).toBe(201);
            expect(response.body).toStrictEqual({
                idLibro: expect.any(String),
                nombre: mockLocalBook.nombre,
                totalPaginas: mockLocalBook.totalPaginas,
                editorial: mockLocalBook.editorial,
                fechaPublicacion: expect.any(String),
                genero: mockLocalBook.genero,
                descripcion: mockLocalBook.descripcion,
                author: {
                    idAutor: mockLocalBook.author.idAutor,
                    nombre: mockLocalBook.author.nombre,
                    apellidoPaterno: mockLocalBook.author.apellidoPaterno,
                    apellidoMaterno: mockLocalBook.author.apellidoMaterno,
                    fechaNacimiento: expect.any(String)
                },
                idAutor: mockLocalBook.idAutor,
                users: []
            });
      
          });*/
        
          it('/book/id (PUT) update book', async () => {
            let idUToUpdate = 1;    
            let mockLocalBook:Book = {
                idLibro: 1,
                nombre: 'Libro de prueba',
                totalPaginas: '420',
                editorial: 'Alianza',
                fechaPublicacion: new Date("1935-05-20"),
                genero: "Novela",
                descripcion: "Desripcion de prueba lobo estepario",
                idAutor: 1,
                author: authorHH,
                users: []
            }
      
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
            const response = await request(app.getHttpServer())
                .put('/book/'+ idUToUpdate)
                .set('Authorization', `Bearer ${token}`)
                .send(mockLocalBook);
    
            expect(response.statusCode).toBe(200);
            expect(response.body).toStrictEqual({
                idLibro: expect.any(Number),
                nombre: mockLocalBook.nombre,
                totalPaginas: mockLocalBook.totalPaginas,
                editorial: mockLocalBook.editorial,
                fechaPublicacion: expect.any(String),
                genero: mockLocalBook.genero,
                descripcion: mockLocalBook.descripcion,
                author: {
                    idAutor: mockLocalBook.author.idAutor,
                    nombre: mockLocalBook.author.nombre,
                    apellidoPaterno: mockLocalBook.author.apellidoPaterno,
                    apellidoMaterno: mockLocalBook.author.apellidoMaterno,
                    fechaNacimiento: expect.any(String)
                },
                idAutor: mockLocalBook.idAutor,
                users: []
            });
        });
    
        it('/book/id (DELETE) delete book', async () => {
            let idToDelete = 1;
            const response = await request(app.getHttpServer())
                .delete('/book/'+ idToDelete)
                .set('Authorization', `Bearer ${token}`);
            expect(response.statusCode).toBe(200);
        });


    });


    describe('BookController (e2e), extra uses cases', () => {
        
        it('/book (GET), no books in database, should show exception', async () => {
            jest.spyOn(mockBookRepository, 'find').mockReturnValue(emptyMock);
            const response = request(app.getHttpServer())
                .get('/book')
                .set('Authorization', `Bearer ${token}`);
            
            response.expect(500);        
        });

        it('/book/id (DELETE), Should not delete a book when user id does not exist', async () => {
            let idToDelete = 16;
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .delete('/book/'+ idToDelete)
                .set('Authorization', `Bearer ${token}`);
                
            expect(response.statusCode).toBe(500);
        });

        it('/book/id (GET) should not get a book that does not exist', async () => {
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
            let bookId = 100;
            const response = await request(app.getHttpServer())
                .get('/book/'+ bookId)
                .set('Authorization', `Bearer ${token}`);

            expect(response.statusCode).toBe(500);
        });

        it('/book/id (PUT) Should not update book that does not exits', async () => {
            let idUToUpdate = 100;    
            let mockLocalBook:Book = {
                idLibro: 100,
                nombre: 'Libro de prueba',
                totalPaginas: '420',
                editorial: 'Alianza',
                fechaPublicacion: new Date("1935-05-20"),
                genero: "Novela",
                descripcion: "Desripcion de prueba lobo estepario",
                idAutor: 1,
                author: authorHH,
                users: []
            }
      
            jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
            const response = await request(app.getHttpServer())
                .put('/book/'+ idUToUpdate)
                .set('Authorization', `Bearer ${token}`)
                .send(mockLocalBook);
            expect(response.statusCode).toBe(500);      
        });

        it('/book (POST) Should not create new book when author does not exist', async () => {
    
            let mockLocalBook:Book = {
                idLibro: 1,
                nombre: 'Libro de prueba',
                totalPaginas: '420',
                editorial: 'Alianza',
                fechaPublicacion: new Date("1935-05-20"),
                genero: "Novela",
                descripcion: "Desripcion de prueba lobo estepario",
                idAutor: 1,
                author: authorHH,
                users: []
            }
            
            jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(emptyMock);
    
            const response = await request(app.getHttpServer())
                .post('/book')
                .send(mockLocalBook)
                .set('Authorization', `Bearer ${token}`);
    
            expect(response.statusCode).toBe(500);
                  
        });

    });

    

});