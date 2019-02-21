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

    async addUser(user){
        const { User } = this.server.models();
        return await User.query().insert(user);
    }

    async deleteUser(id){
        const { User } = this.server.models();
        return await User.query().delete().where('id', '=', id);
    }

    async editUser(id, user){
        const { User } = this.server.models();
        return await User.query().patch(user).where('id', '=', id);
    }

    generateUser(){
        for ( let i = 0; i < 100; i++){
            const user = {
                login: faker.internet.userName(),
                password: encrypt(faker.internet.password(8)),
                email: faker.internet.email(),
                firstname: faker.name.firstName(),
                lastname: faker.name.lastName(),
                company: faker.company.companyName(),
                function: faker.name.jobType()
            };
            this.addUser(user);
        }

        return 'Les users ont bien été générés et insérés ';
    }

};
