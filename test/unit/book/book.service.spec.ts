import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './../../../src/book/book.service';
import { AuthorService } from './../../../src/author/author.service';
import { Book } from './../../../src/book/entity/book.entity';
import { Author } from './../../../src/author/entity/author.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { response } from 'express';

describe('BookService', () => {
  let service: BookService;

  let authorMK = new Author(1,'Milan','Kundera','',new Date("1935-05-20"))
  let authorHH = new Author(2,'Hermann','Hesse','',new Date("1942-08-22"))

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

  let emptyMock = null;

  let mockAuthor = {
    idAutor: 2,
    nombre: 'Hermann',
    apellidoPaterno: 'Hesse',
    apellidoMaterno: '',
    fechaNacimiento: new Date("1942-08-22"),
    books: mockBook
    }

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile(); 

    service = module.get<BookService>(BookService);
  });


  it('Book service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('BookService CRUD operations', () => {

    it('Should find all books', async () => { 
      jest.spyOn(mockBookRepository, 'find').mockReturnValue(mockBook);
      let response = await service.findAll();
      expect(response).toEqual(mockBook);
      expect(mockBookRepository.find).toHaveBeenCalled();
    });

    it('Should find a book by id', async () => { 
      const bookIdToFind = 1;      

      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);

      const result = await service.findBook(bookIdToFind);
      expect(result).toEqual(mockBook);
      expect(mockBookRepository.findOne).toHaveBeenCalled();
      expect(mockBookRepository.findOne).toHaveBeenCalledWith({ where: { idLibro:bookIdToFind } });

    });

   it('Should create a new book', async () => {
    let createBookDto:Book = {
        idLibro: 2,
        nombre: 'La insoportable levedad del ser',
        totalPaginas: '320',
        editorial: 'Tusquets',
        fechaPublicacion: new Date("1935-05-20"),
        genero: "Novela",
        descripcion: "Descripcion de prueba insoportable levedad del ser",
        idAutor: 2,
        author: authorMK,
        users: []
    }           

        jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
      expect(await service.createBook(createBookDto)).toStrictEqual({
        idLibro: createBookDto.idLibro,
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

      const idToUpdate = 1; 
      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);

      const result = await service.updateBook(idToUpdate, updateBookDto);

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
    expect(mockBookRepository.save).toHaveBeenCalled();

    });

    it('Should delete a book', async () => {       
      const idDelete = 1;
      jest.spyOn(mockBookRepository, 'delete').mockReturnValue(mockBook);
      const result = await service.deleteBook(idDelete);
      expect(result).toEqual(mockBook);
      expect(mockBookRepository.delete).toHaveBeenCalled();
    });

  });

  describe('BookService specific use cases', () => {

    it('Should not find the book when ID does not exist in DB', async () => { 
      const bookId = 35;
      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
      expect(await (await service.findBook(bookId)).idLibro).not.toEqual(
        bookId,
      );      
    });

    it('Should not delete a book when user id does not exist', async () => {       
      let idNotExist = 25;
      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
      jest.spyOn(mockBookRepository, 'delete').mockReturnValue(mockBook);
      expect(async () => {
        await service.deleteBook(idNotExist)
      }).rejects.toThrow("Specified book id 25 was not found");

    });

    it('Should throw error when there are no books in DB when calling findAll', async () => { 
      jest.spyOn(mockBookRepository, 'find').mockReturnValue(emptyMock);
      expect(async () => {
        await service.findAll()
      }).rejects.toThrow("Books were not found in database");
    });

    it('Should not update a book when book id does not exist', async () => {       
      let idNotExist = 54;
      const updateBookDto:Book = {
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

      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(emptyMock);
      jest.spyOn(mockBookRepository, 'findOne').mockReturnValue(mockBook);
      const result = await service.updateBook(idNotExist, updateBookDto)           
      expect(result.idLibro).not.toEqual(
        idNotExist,
      );

    });   

  });

});