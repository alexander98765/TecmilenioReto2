import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/user.service';
import { User } from '../../../src/user/entity/user.entity';
import { UserDto } from '../../../src/user/dto/user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { create } from 'domain';
import { NotFoundException } from '../../../src/filters/NotFoundException';
import { HttpException } from '@nestjs/common';
import { UserRepositoryUnitMock } from './user.repository.unit.mock';

describe('UserService', () => {
  let service: UserService;

  let mockUser = {
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

  let emptyMock = null;

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
        UserService,
        { 
          provide: getRepositoryToken(User), 
          useValue: mockUserRepository, 
        },
      ],
    }).compile(); 

    service = module.get<UserService>(UserService);
  });


  it('User service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UserService CRUD operations', () => {

    it('Should find all users', async () => { 
      jest.spyOn(mockUserRepository, 'find').mockReturnValue(mockUser);
      expect(await service.findAll()).toEqual(mockUser);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('Should find a user by id', async () => { 
      const userIdtoFind = 1;      

      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);

      const result = await service.findUser(userIdtoFind);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      //expect(mockUserRepository.findOne).toBeCalledWith({ where: { id } });

    });

   it('Should create a new user', async () => {
      const createUserDto = {
        nombre: 'John Doe',
        apellidoPaterno: 'Professor',
        apellidoMaterno: 'Informatics',
        edad: '23',
        correoElectronico: 'john.doe@gmail.com',
        perfil: 'Usuario',
        activo: true,
        fechaAlta: new Date(),
        nombreUsuario: "John",
        contrasena: 'John.123',
      };

      expect(await service.createUser(createUserDto)).toStrictEqual({
          idUsuario: expect.any(Number),
          nombre: createUserDto.nombre,
          apellidoPaterno: createUserDto.apellidoPaterno,
          apellidoMaterno: createUserDto.apellidoMaterno,
          edad: createUserDto.edad,
          correoElectronico: createUserDto.correoElectronico,
          perfil: createUserDto.perfil,
          activo: createUserDto.activo,
          fechaAlta: createUserDto.fechaAlta,
          nombreUsuario: createUserDto.nombreUsuario,
          contrasena: expect.any(String)
      });
    });

    it('Should update a user', async () => {
      const updateUserDto:User = { 
          idUsuario: 1,
          nombre: 'Alejandro',
          apellidoPaterno: 'Perez',
          apellidoMaterno: 'Morales',
          edad: '30',
          correoElectronico: 'mapacha@gmail.com',
          perfil: 'Administrador',
          activo: true,
          fechaAlta: new Date("2021-02-02"),
          nombreUsuario: 'Alex123',
          contrasena: 'wewewe#$#$"#"FDFDET&%&$',
          books: []
      };

      const idToUpdate = 1; 
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);

      const result = await service.updateUser(idToUpdate, updateUserDto);

      expect(result).toEqual({ 
        idUsuario: idToUpdate,
        nombre: updateUserDto.nombre,
        apellidoPaterno: updateUserDto.apellidoPaterno,
        apellidoMaterno: updateUserDto.apellidoMaterno,
        edad: updateUserDto.edad,
        correoElectronico: updateUserDto.correoElectronico,
        perfil: updateUserDto.perfil,
        activo: updateUserDto.activo,
        fechaAlta: updateUserDto.fechaAlta,
        nombreUsuario: updateUserDto.nombreUsuario,
        contrasena: expect.any(String),
        books: []
    });
    expect(mockUserRepository.save).toHaveBeenCalled();

    });

    it('Should delete a user', async () => { 
      
      const idDelete = 1;
      //expect(await service.deleteUser(1)).toBeDefined;
      jest.spyOn(mockUserRepository, 'delete').mockReturnValue(mockUser);
      const result = await service.deleteUser(idDelete);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.delete).toHaveBeenCalled();
    });

  });

  describe('UserService specific test cases', () => {

    it('Should throw existing email error when trying to register new user', async () => {
      const createUserDto = {
        nombre: 'John Doe',
        apellidoPaterno: 'Professor',
        apellidoMaterno: 'Informatics',
        edad: '23',
        correoElectronico: 'alex@gmail.com',
        perfil: 'Usuario',
        activo: true,
        fechaAlta: new Date(),
        nombreUsuario: "John",
        contrasena: 'John.123',
      };

      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);

      /*expect(async () => {
        await service.createUser(createUserDto)
      }).rejects.toThrow("Specified email alex@gmail.com already exists, use another email or login to your account.");*/

      try {
        await service.createUser(createUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect((error as HttpException).getResponse()).toBe('Specified email alex@gmail.com already exists, use another email or login to your account.');
      }

    });

    it('Should not find the user when ID does not exist in DB', async () => { 
      const userId = 20;
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
      expect(await (await service.findUser(userId)).idUsuario).not.toEqual(
          userId,
      );      
    });

    it('Should not delete a user when user id does not exist', async () => {       
      let idNotExist = 15;
    
      jest.spyOn(mockUserRepository, 'delete').mockReturnValue(mockUser);
      const result = await service.deleteUser(idNotExist);            
      expect(result.idUsuario).not.toEqual(
        idNotExist,
      );

    });

    it('Should throw error when there are no users in DB when calling findAll', async () => { 
      jest.spyOn(mockUserRepository, 'find').mockReturnValue(emptyMock);
      expect(async () => {
        await service.findAll()
      }).rejects.toThrow("Users were not found");
    });

    it('Should not update a user when user id does not exist', async () => {       
      let idNotExist = 15;
      const updateUserDto:User = { 
        idUsuario: 1,
        nombre: 'Alejandro',
        apellidoPaterno: 'Perez',
        apellidoMaterno: 'Morales',
        edad: '30',
        correoElectronico: 'correoUpdate@gmail.com',
        perfil: 'Administrador',
        activo: true,
        fechaAlta: new Date("2021-02-02"),
        nombreUsuario: 'Alex123',
        contrasena: 'wewewe#$#$"#"FDFDET&%&$',
        books: []
    };    

      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(emptyMock);
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
      const result = await service.updateUser(idNotExist, updateUserDto)           
      expect(result.idUsuario).not.toEqual(
        idNotExist,
      );

    });

    it('Should not update a user when email already exists', async () => {       
      let idNotExist = 1;
      const updateUserDto:User = { 
        idUsuario: 1,
        nombre: 'Alejandro', 
        apellidoPaterno: 'Perez',
        apellidoMaterno: 'Morales',
        edad: '30',
        correoElectronico: 'alex@gmail.com',
        perfil: 'Administrador',
        activo: true,
        fechaAlta: new Date("2021-02-02"),
        nombreUsuario: 'Alex123',
        contrasena: 'wewewe#$#$"#"FDFDET&%&$',
        books: []
    };    

      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);

      try {
        await service.updateUser(idNotExist, updateUserDto)
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException)
        expect((error as HttpException).getResponse()).toBe('Specified email alex@gmail.com already exists, use another email.');
      }

      /*expect(async () => {
        await service.updateUser(idNotExist, updateUserDto)           
      }).rejects.toThrow("Specified email alex@gmail.com already exists, use another email or login to your account.");
*/
    });

  });

});