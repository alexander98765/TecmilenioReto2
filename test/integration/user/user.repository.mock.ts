import { User } from "../../../src/user/entity/user.entity";

export class UserRepositoryMock {
    mockUser: User = { 
        idUsuario: 0,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        edad: '',
        correoElectronico: '',
        perfil: '',
        activo: false,
        fechaAlta: new Date(),
        nombreUsuario: '',
        contrasena: '',
        books: []
    };

    async find() { 
        return Promise.resolve([this.mockUser]);
    }

}