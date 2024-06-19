import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from "./../../../src/book/book.controller";
import { BookService } from "./../../../src/book/book.service";
import { Book } from './../../../src/book/entity/book.entity';
import { Author } from './../../../src/author/entity/author.entity';

describe('Book Controller', () => {
    let controller: BookController;

    let authorMK = new Author(1,'Milan','Kundera','',new Date("1935-05-20"))

    let mockBook:Book = {
        idLibro: 1,
        nombre: 'La insoportable levedad del ser',
        totalPaginas: '320',
        editorial: 'Tusquets',
        fechaPublicacion: new Date("1935-05-20"),
        genero: "Novela",
        descripcion: "Descripcion de prueba insoportable levedad del ser",
        idAutor: 1,
        author: authorMK,
        users: []
    }

    let mockBookService = {
        findAll: jest.fn(),
        findBook: jest.fn(),
        createBook: jest.fn((dto) => { 
          return {
            idLibro: Math.random() * (1000 - 1) + 1, 
            ...dto, 
          };
        }),
        updateBook: jest.fn((idLibro, dto) => {
          return Promise.resolve({      
            ...dto,
          });
        }),
        deleteBook: jest.fn().mockImplementation((idUsuario) => { 
          return Promise.resolve({
            raw: [],
            affected: 1,
          });
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [BookController],
          providers: [BookService],
        })
          .overrideProvider(BookService) 
          .useValue(mockBookService) 
          .compile(); 
    
        controller = module.get<BookController>(BookController);
    });

    it('Book controller should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('BookController CRUD operations', () => {

        it('Should create a new book', async () => {
            let createBookDto:Book = {
                idLibro: 1,
                nombre: 'La insoportable levedad del ser',
                totalPaginas: '320',
                editorial: 'Tusquets',
                fechaPublicacion: new Date("1935-05-20"),
                genero: "Novela",
                descripcion: "Descripcion de prueba insoportable levedad del ser",
                idAutor: 1,
                author: authorMK,
                users: []
            }           
            expect(await controller.createBook(createBookDto)).toStrictEqual({
                idLibro: expect.any(Number),
                nombre: createBookDto.nombre,
                totalPaginas: createBookDto.totalPaginas,
                editorial: createBookDto.editorial,
                fechaPublicacion: createBookDto.fechaPublicacion,
                genero: createBookDto.genero,
                descripcion: createBookDto.descripcion,
                idAutor: createBookDto.idAutor,
                author: createBookDto.author,
                users: createBookDto.users
            });
        });

        it('Should update a book', async () => {
            const updateBookDto:Book = {
                idLibro: 1,
                nombre: 'La insoportable levedad del ser Updated',
                totalPaginas: '320',
                editorial: 'Tusquets Updated',
                fechaPublicacion: new Date("1935-05-20"),
                genero: "Novela",
                descripcion: "Descripcion de prueba insoportable levedad del ser",
                idAutor: 1,
                author: authorMK,
                users: []
            }
    
            const idToUpdate = 1; 
            jest.spyOn(mockBookService, 'findBook').mockReturnValue(mockBook);
    
            const result = await controller.updateBook(idToUpdate, updateBookDto);

            expect(result).toEqual({ 
                idLibro: updateBookDto.idLibro,
                nombre: updateBookDto.nombre,
                totalPaginas: updateBookDto.totalPaginas,
                editorial: updateBookDto.editorial,
                fechaPublicacion: updateBookDto.fechaPublicacion,
                genero: updateBookDto.genero,
                descripcion: updateBookDto.descripcion,
                idAutor: updateBookDto.idAutor,
                author: updateBookDto.author,
                users: updateBookDto.users        
            });
            expect(mockBookService.updateBook).toHaveBeenCalled();
    
        });

        it('Should find all books', async () => { 
            jest.spyOn(mockBookService, 'findAll').mockReturnValue(mockBook);
            let response = await controller.findAll();            
            expect(response).toEqual(mockBook);
            expect(mockBookService.findAll).toHaveBeenCalled();
        });

        it('Should find a book by id', async () => { 
            const bookIdToFind = 1;      
      
            jest.spyOn(mockBookService, 'findBook').mockReturnValue(mockBook);
      
            const result = await controller.findBook(bookIdToFind);
            expect(result).toEqual(mockBook);
            expect(mockBookService.findBook).toHaveBeenCalled();     
        });

        it('Should delete a book', async () => {       
            const idDelete = 1;
            jest.spyOn(mockBookService, 'deleteBook').mockReturnValue(mockBook);
            const result = await controller.deleteBook(idDelete);
            expect(result).toEqual(mockBook);
            expect(mockBookService.deleteBook).toHaveBeenCalled();
        });

    });

});