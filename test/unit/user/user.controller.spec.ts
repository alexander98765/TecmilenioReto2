import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './../../../src/user/user.controller';
import { UserService } from './../../../src/user/user.service';
import { User } from './../../../src/user/entity/user.entity';
import { HttpException } from '@nestjs/common';

describe('User Controller', () => {
  let controller: UserController;

  let mockUserService = {
    findAll: jest.fn(),
    findUser: jest.fn(),
    createUser: jest.fn((dto) => { 
      return {
        idUsuario: Math.random() * (1000 - 1) + 1, 
        ...dto, 
      };
    }),
    updateUser: jest.fn((idUsuario, dto) => {
      return Promise.resolve({      
        ...dto,
      });
    }),
    deleteUser: jest.fn().mockImplementation((idUsuario) => { 
      return Promise.resolve({
        raw: [],
        affected: 1,
      });
    })
  };

  const mockUser = { 
    idUsuario: 1,
    nombre: 'Alejandro',
    apellidoPaterno: 'Perez',
    apellidoMaterno: 'Morales',
    edad: '30',
    correoElectronico: 'alex@gmail.com',
    perfil: 'Administrador',
    activo: true,
    fechaAlta: new Date(),
    nombreUsuario: 'Alex123',
    contrasena: 'wewewe#$#$"#"FDFDET&%&$',
    books: []
  }; 

  const emptyMock = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService) 
      .useValue(mockUserService) 
      .compile(); 

    controller = module.get<UserController>(UserController);
  });

  describe('UserController CRUD operations', () => {

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

      expect(await controller.createUser(createUserDto)).toStrictEqual({
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
      jest.spyOn(mockUserService, 'findUser').mockReturnValue(mockUser);

      const result = await controller.updateUser(idToUpdate, updateUserDto);

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
    expect(mockUserService.updateUser).toHaveBeenCalled();

    });

    it('Should find all users', async () => { 
      jest.spyOn(mockUserService, 'findAll').mockReturnValue(mockUser);
      expect(await controller.findAll()).toEqual(mockUser);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });

    it('Should find a user by id', async () => { 
      const userIdtoFind = 1;      
      jest.spyOn(mockUserService, 'findUser').mockReturnValue(mockUser);
      const result = await controller.findUser(userIdtoFind);
      expect(result).toEqual(mockUser);
      expect(mockUserService.findUser).toHaveBeenCalled();

    });

    it('Should delete a user', async () => { 
      const idDelete = 1;
      jest.spyOn(mockUserService, 'deleteUser').mockReturnValue(mockUser);
      const result = await controller.deleteUser(idDelete);
      expect(result).toEqual(mockUser);
      expect(mockUserService.deleteUser).toHaveBeenCalled();
    });

  });

});