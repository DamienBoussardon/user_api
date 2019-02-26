'use strict';

const { Service }  = require('schmervice');
const faker =  require('faker');
const { encrypt } = require('iut-encrypt');

module.exports = class UserService extends Service {


    async getAllUsers(){
        const { User } = this.server.models();
        return await User.query();
    }

    async getUserById(id){
        const { User } = this.server.models();
        return await User.query().where('id', id);
    }

    async authUser(login, password){
        const { User } = this.server.models();
        const passwordEncrypted = encrypt(password);
        const user = await User.query().where('login', login);
        if (user[0].password === passwordEncrypted){
            return await '{ msg: \'ok\' }';
        }

        return await '{ msg: \'ko\' }';
    }

    async addUser(user){
        user.password = encrypt(user.password);
        const { User } = this.server.models();
        return await User.query().insert(user);
    }

    async deleteUser(id){
        const { User } = this.server.models();
        return await User.query().delete().where('id', '=', id);
    }

    async editUser(id, user){
        const { User } = this.server.models();
        return await User.query().patch(await this.checkedPassword(id, user)).where('id', '=', id);
    }

    async checkedPassword(id, user){
        const userSelected = await this.getUserById(id);
        const passwordInBase = userSelected[0].password;
        const passwordEncrypt = encrypt(user.password);
        if (passwordEncrypt !== passwordInBase || user.password !== passwordInBase){
            user.password = encrypt(user.password);
        }

        return user;

    }

    async generateUser() {
        for (let i = 0; i < 100; i++) {
            const user = {
                login: faker.internet.userName(),
                password: faker.internet.password(8),
                email: faker.internet.email(),
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                company: faker.company.companyName(),
                function: faker.name.jobType()
            };
            await this.addUser(user);
        }
    }
};
