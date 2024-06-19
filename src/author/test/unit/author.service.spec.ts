import { Test, TestingModule } from '@nestjs/testing';
import { AuthorService } from '../../author.service';
import { Author } from '../../entity/author.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthorService', () => {
  let service: AuthorService;

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

  let emptyMock = [];

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
        AuthorService,
        { 
          provide: getRepositoryToken(Author), 
          useValue: mockAuthorRepository, 
        },
      ],
    }).compile(); 

    service = module.get<AuthorService>(AuthorService);
  });


  it('Author service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('AuthorService CRUD operations', () => {

    it('Should find all authors', async () => { 
      jest.spyOn(mockAuthorRepository, 'find').mockReturnValue(mockAuthor);
      expect(await service.findAll()).toEqual(mockAuthor);
      expect(mockAuthorRepository.find).toHaveBeenCalled();
    });

    it('Should find an author by id', async () => { 
      const authorIdToFind = 1;      

      jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);

      const result = await service.findAuthor(authorIdToFind);

      expect(result).toEqual(mockAuthor);
      expect(mockAuthorRepository.findOne).toHaveBeenCalled();
      expect(mockAuthorRepository.findOne).toHaveBeenCalledWith({ where: { idAutor:authorIdToFind } });

    });

   it('Should create a new author', async () => {
      const createAuthorDto:Author = {
        idAutor: 2,
        nombre: 'Hermann',
        apellidoPaterno: 'Hesse',
        apellidoMaterno: '',
        fechaNacimiento: new Date("1942-08-12"),
        books: []
      };      

      expect(await service.createAuthor(createAuthorDto)).toStrictEqual({
        idAutor: expect.any(Number),
        nombre: createAuthorDto.nombre,
        apellidoPaterno: createAuthorDto.apellidoPaterno,
        apellidoMaterno: createAuthorDto.apellidoMaterno,
        fechaNacimiento: createAuthorDto.fechaNacimiento,
        books: createAuthorDto.books
      });
    });

    it('Should update an author', async () => {
        const updateAuthorDto : Author = {
            idAutor: 1,
            nombre: 'Hermann',
            apellidoPaterno: 'Hesse',
            apellidoMaterno: '',
            fechaNacimiento: new Date("1942-08-12"),
            books: []
        };

      const idToUpdate = 1; 
      jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);

      const result = await service.updateAuthor(idToUpdate, updateAuthorDto);

      expect(result).toEqual({ 
        idAutor: idToUpdate,
        nombre: updateAuthorDto.nombre,
        apellidoPaterno: updateAuthorDto.apellidoPaterno,
        apellidoMaterno: updateAuthorDto.apellidoMaterno,
        fechaNacimiento: updateAuthorDto.fechaNacimiento,
        books: updateAuthorDto.books        
    });
    expect(mockAuthorRepository.save).toHaveBeenCalled();

    });

    it('Should delete an author', async () => { 
      
      const idDelete = 1;
      jest.spyOn(mockAuthorRepository, 'delete').mockReturnValue(mockAuthor);
      const result = await service.deleteAuthor(idDelete);
      expect(result).toEqual(mockAuthor);
      expect(mockAuthorRepository.delete).toHaveBeenCalled();
    });

  });

  describe('AuthorService specific use cases', () => {

    it('Should not find the author when ID does not exist in DB', async () => { 
      const authorId = 35;
      jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
      expect(await (await service.findAuthor(authorId)).idAutor).not.toEqual(
        authorId,
      );      
    });

    it('Should not delete an author when user id does not exist', async () => {       
      let idNotExist = 25;
    
      jest.spyOn(mockAuthorRepository, 'delete').mockReturnValue(mockAuthor);
      const result = await service.deleteAuthor(idNotExist);            
      expect(result.idAutor).not.toEqual(
        idNotExist,
      );

    });

    it('Should throw error when there are no authors in DB when calling findAll', async () => { 
      jest.spyOn(mockAuthorRepository, 'find').mockReturnValue(emptyMock);
      expect(async () => {
        await service.findAll()
      }).rejects.toThrow("Author were not found in database");
    });

    it('Should not update an author when author id does not exist', async () => {       
      let idNotExist = 54;
      const updateAuthorDto:Author = { 
        idAutor: 1,
        nombre: 'HermannUpdate',
        apellidoPaterno: 'HesseUpdate',
        apellidoMaterno: '',
        fechaNacimiento: new Date("1942-08-12"),
        books: []
      };    

      jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(emptyMock);
      jest.spyOn(mockAuthorRepository, 'findOne').mockReturnValue(mockAuthor);
      const result = await service.updateAuthor(idNotExist, updateAuthorDto)           
      expect(result.idAutor).not.toEqual(
        idNotExist,
      );

    });    

  });

});