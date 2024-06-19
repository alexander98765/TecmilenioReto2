import { Test, TestingModule } from '@nestjs/testing';
import { Author } from '../../entity/author.entity';
import { Book } from '../../../book/entity/book.entity';
import { AuthorService } from '../../author.service';
import { AuthorController } from '../../author.controller';

describe('Author Controller', () => {
    let controller: AuthorController;

    let book = new Book(1, "Lobo estepario", "420", "Alianza", new Date("1935-05-20"), "Novela", "Desripcion de prueba lobo estepario")

    const mockAuthor:Author = {
        idAutor: 1,
        nombre: 'Hermann',
        apellidoPaterno: 'Hesse',
        apellidoMaterno: '',
        fechaNacimiento: new Date("1942-08-12"),
        books: [book]
    };

    let mockAuthorService = {
        findAll: jest.fn(),
        findAuthor: jest.fn(),
        createAuthor: jest.fn((dto) => { 
          return {
            idAutor: Math.random() * (1000 - 1) + 1, 
            ...dto, 
          };
        }),
        updateAuthor: jest.fn((idUsuario, dto) => {
          return Promise.resolve({      
            ...dto,
          });
        }),
        deleteAuthor: jest.fn().mockImplementation((idAutor) => { 
          return Promise.resolve({
            raw: [],
            affected: 1,
          });
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [AuthorController],
          providers: [AuthorService],
        })
          .overrideProvider(AuthorService) 
          .useValue(mockAuthorService) 
          .compile(); 
    
        controller = module.get<AuthorController>(AuthorController);
    });

    it('Author controller should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('AuthorController CRUD operations', () => {
        it('Should create a new author', async () => {
            const createAuthorDto:Author = {
              idAutor: 1,
              nombre: 'Hermann',
              apellidoPaterno: 'Hesse',
              apellidoMaterno: '',
              fechaNacimiento: new Date("1942-08-12"),
              books: [book]
            };      

            expect(await controller.createAuthor(createAuthorDto)).toStrictEqual({
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
                books: [book]
            };
    
            const idToUpdate = 1; 
            jest.spyOn(mockAuthorService, 'findAuthor').mockReturnValue(mockAuthor);
    
            const result = await controller.updateAuthor(idToUpdate, updateAuthorDto);
            expect(result).toEqual({ 
                idAutor: idToUpdate,
                nombre: updateAuthorDto.nombre,
                apellidoPaterno: updateAuthorDto.apellidoPaterno,
                apellidoMaterno: updateAuthorDto.apellidoMaterno,
                fechaNacimiento: updateAuthorDto.fechaNacimiento,
                books: updateAuthorDto.books        
            });
            expect(mockAuthorService.updateAuthor).toHaveBeenCalled();
    
        });

        it('Should find all authors', async () => { 
            jest.spyOn(mockAuthorService, 'findAll').mockReturnValue(mockAuthor);
            expect(await controller.findAll()).toEqual(mockAuthor);
            expect(mockAuthorService.findAll).toHaveBeenCalled();
        });

        it('Should find an author by id', async () => { 
            const authorIdToFind = 1;      
      
            jest.spyOn(mockAuthorService, 'findAuthor').mockReturnValue(mockAuthor);
      
            const result = await controller.findAuthorById(authorIdToFind);            
            expect(result).toEqual(mockAuthor);
            expect(mockAuthorService.findAuthor).toHaveBeenCalled();
      
        });

        it('Should delete an author', async () => { 
            const idDelete = 1;
            jest.spyOn(mockAuthorService, 'deleteAuthor').mockReturnValue(mockAuthor);
            const result = await controller.deleteAuthor(idDelete);
            expect(result).toEqual(mockAuthor);
            expect(mockAuthorService.deleteAuthor).toHaveBeenCalled();
        });

    });

});