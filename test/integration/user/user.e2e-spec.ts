import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import supertest, * as request from 'supertest';
import { UserModule } from '../../../src/user/user.module';
import { User } from '../../../src/user/entity/user.entity'
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserRepositoryMock } from './user.repository.mock';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../../../src/auth/jwt.strategy';
import { AppModule } from '../../../src/app.module';
import { UserService } from '../../../src/user/user.service';
//import { configService } from 'config/config.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let token:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFsZXhQZXJleiIsInBlcmZpbCI6IkFkbWluaXN0cmFkb3IiLCJpYXQiOjE3MTg0NjE0ODEsImV4cCI6MTcxODUwNDY4MX0.XL06tyz_fC0ZHKAArAyUNCh5MOLvVhvMmn79hAGF4LU";

  const mockUser: User = { 
    idUsuario: 1,
    nombre: 'Alejandro',
    apellidoPaterno: 'Perez',
    apellidoMaterno: 'Morales',
    edad: '30',
    correoElectronico: 'testing@gmail.com',
    perfil: 'Administrador',
    activo: false,
    fechaAlta: new Date("2024-05-12"),
    nombreUsuario: 'Alex123',
    contrasena: '$2b$10$/qHJV8zWSXC6KwaR71tnAe4R/HJmkxXIsRdImbI7Krcwjio/EVYae',
    books: []
  };

  const emptyMock = null;

  const mockUserRepository = {     
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
    
  });

  beforeAll(async () => {

      const moduleFixture: TestingModule = await Test.createTestingModule({
        //imports: [
          /*TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'Mapacha.77',
            database: 'biblioteca',
            
            synchronize: false
          }),
          TypeOrmModule.forFeature([User]),*/
          //AppModule,
          
        //],
        imports:[AppModule, UserModule],
        //providers: [UserService],
      })
        .overrideGuard(JwtStrategy)
        .useValue({ canActivate: () => true })
        .overrideProvider(getRepositoryToken(User)) 
        .useValue(mockUserRepository) 
        .compile();
  
      app = moduleFixture.createNestApplication();
      await app.init();

      /*const response = await app.get('/auth/login');
      token = response.body.token;*/
  })

  describe('UserController (e2e), CRUD operations', () => {

    it('/user (GET) get all users', async () => {

      jest.spyOn(mockUserRepository, 'find').mockReturnValue(mockUser);

      let res = request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`);

      expect((await res).body).toStrictEqual({
        idUsuario: expect.any(Number),
        nombre: mockUser.nombre,
        apellidoPaterno: mockUser.apellidoPaterno,
        apellidoMaterno: mockUser.apellidoMaterno,
        edad: mockUser.edad,
        correoElectronico: mockUser.correoElectronico,
        perfil: mockUser.perfil,
        activo: mockUser.activo,
        fechaAlta: expect.any(String),
        nombreUsuario: mockUser.nombreUsuario,
        contrasena: expect.any(String),
        books: []
      });
      expect((await res).statusCode).toBe(200);      

    });

    it('/user/id (GET) get user by id', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
      let userId = 1;
      const response = await request(app.getHttpServer())
        .get('/user/'+ userId)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        idUsuario: expect.any(Number),
        nombre: mockUser.nombre,
        apellidoPaterno: mockUser.apellidoPaterno,
        apellidoMaterno: mockUser.apellidoMaterno,
        edad: mockUser.edad,
        correoElectronico: mockUser.correoElectronico,
        perfil: mockUser.perfil,
        activo: mockUser.activo,
        fechaAlta: expect.any(String),
        nombreUsuario: mockUser.nombreUsuario,
        contrasena: expect.any(String),
        books: []
      });
    });

    it('/user (POST) create new user', async () => {

      const mockLocalUser: User = { 
        idUsuario: 2,
        nombre: 'Alejandro',
        apellidoPaterno: 'Perez',
        apellidoMaterno: 'Morales',
        edad: '30',
        correoElectronico: 'pruebas@gmail.com',
        perfil: 'Administrador',
        activo: false,
        fechaAlta: new Date("2024-05-12"),
        nombreUsuario: 'Alex123',
        contrasena: 'Alex.123',
        books: []
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${token}`)
        .send(mockLocalUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toStrictEqual({
        idUsuario: expect.any(Number),
        nombre: mockLocalUser.nombre,
        apellidoPaterno: mockLocalUser.apellidoPaterno,
        apellidoMaterno: mockLocalUser.apellidoMaterno,
        edad: mockLocalUser.edad,
        correoElectronico: mockLocalUser.correoElectronico,
        perfil: mockLocalUser.perfil,
        activo: mockLocalUser.activo,
        fechaAlta: expect.any(String),
        nombreUsuario: mockLocalUser.nombreUsuario,
        contrasena: expect.any(String),
        books: []
      });

    });

    it('/user/id (PUT) update user', async () => {
      let idUToUpdate = 1;    
      const mockLocalUser: User = { 
        idUsuario: 1,
        nombre: 'Updated',
        apellidoPaterno: 'Perez',
        apellidoMaterno: 'Morales',
        edad: '30',
        correoElectronico: 'test@gmail.com',
        perfil: 'Administrador',
        activo: false,
        fechaAlta: new Date("2024-05-12"),
        nombreUsuario: 'Alex123',
        contrasena: 'Alex.123',
        books: []
      };

      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(mockUser);
      const response = await request(app.getHttpServer())
        .put('/user/'+ idUToUpdate)
        .set('Authorization', `Bearer ${token}`)
        .send(mockLocalUser);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({
        idUsuario: expect.any(Number),
        nombre: mockLocalUser.nombre,
        apellidoPaterno: mockLocalUser.apellidoPaterno,
        apellidoMaterno: mockLocalUser.apellidoMaterno,
        edad: mockLocalUser.edad,
        correoElectronico: mockLocalUser.correoElectronico,
        perfil: mockLocalUser.perfil,
        activo: mockLocalUser.activo,
        fechaAlta: expect.any(String),
        nombreUsuario: mockLocalUser.nombreUsuario,
        contrasena: expect.any(String),
        books: []
      });
    });

    it('/user/id (DELETE) delete user', async () => {
      let idToDelete = 1;
      const response = await request(app.getHttpServer())
        .delete('/user/'+ idToDelete)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
    });

  });

  describe('UserController (e2e), extra uses cases', () => {
    
    it('/user (GET), no users in database, should show exception', async () => {
      jest.spyOn(mockUserRepository, 'find').mockReturnValue(emptyMock);
      const response = request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${token}`);
      
      response.expect(500);        
    });

    it('/user (POST), should throw error, already existing mail', async () => {

      const mockLocalUser: User = { 
        idUsuario: 2,
        nombre: 'Alejandro',
        apellidoPaterno: 'Perez',
        apellidoMaterno: 'Morales',
        edad: '30',
        correoElectronico: 'test@gmail.com',
        perfil: 'Administrador',
        activo: false,
        fechaAlta: new Date("2024-05-12"),
        nombreUsuario: 'Alex123',
        contrasena: 'Alex.123',
        books: []
      };

      const response = await request(app.getHttpServer())
        .post('/user')
        .set('Authorization', `Bearer ${token}`)
        .send(mockLocalUser);

      expect(response.statusCode).toBe(400);      

    });

    it('/user/id (DELETE), Should not delete a user when user id does not exist', async () => {
      let idToDelete = 16;
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(emptyMock);
      const response = await request(app.getHttpServer())        
        .delete('/user/'+ idToDelete)
        .set('Authorization', `Bearer ${token}`)

      expect(response.statusCode).toBe(500);
    });

    it('/user/id (GET) Should not get a user that does not exist', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(emptyMock);
      let userId = 100;
      const response = await request(app.getHttpServer())
        .get('/user/'+ userId)
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(500);
    });

    it('/user/id (PUT) Should not update user that does not exits', async () => {
      let idUToUpdate = 100;    
      const mockLocalUser: User = { 
        idUsuario: 100,
        nombre: 'Updated',
        apellidoPaterno: 'Perez',
        apellidoMaterno: 'Morales',
        edad: '30',
        correoElectronico: 'testing@gmail.com',
        perfil: 'Administrador',
        activo: false,
        fechaAlta: new Date("2024-05-12"),
        nombreUsuario: 'Alex123',
        contrasena: 'Alex.123',
        books: []
      };

      jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(emptyMock);
      const response = await request(app.getHttpServer())
        .put('/user/'+ idUToUpdate)
        .set('Authorization', `Bearer ${token}`)
        .send(mockLocalUser);

      expect(response.statusCode).toBe(500);      
    });

  });

});