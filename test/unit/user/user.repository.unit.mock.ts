import { User } from "../../../src/user/entity/user.entity";

/*export class UserRepositoryUnitMock {
    mockUser = {
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

    emptyMock = [];

    async find(): Promise<User[]> { 
        return Promise.resolve([this.mockUser]);
    }

}*/

export const UserRepositoryUnitMock = {
    async find(){

    }
}

//module.exports = UserRepositoryUnitMock