'use strict';

const UserSchema  =  require('../schemas/user-schema');
const Joi =  require('joi');


module.exports = [
    {
        method: 'GET',
        path: '/users',
        options: {
            tags: ['api']
        },
        async handler(request, h){
            const { userService } = request.services();
            const users = await userService.getAllUsers();
            return h.response(users).code(200);
        }

    },
    {
        method: 'GET',
        path: '/users/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },
            async handler(request, h){
                const { userService } = request.services();
                const user = await userService.getUserById(request.params.id);
                return h.response(user).code(200);
            }
        }
    },
    {
        method: 'POST',
        path: '/users/generate',
        options: {
            tags: ['api'],
            async handler(request, h){
                const { userService } = request.services();
                await userService.generateUser();
                return h.response('The user generation is a sucess').code(201);
            }
        }
    },
    {
        method: 'PUT',
        path: '/users/edit/{id}',
        options: {
            tags: ['api'],
            validate: {
                payload : UserSchema ,
                params: {
                    id: Joi.number().required()
                }
            },
            async handler(request, h) {
                const { userService } = request.services();
                const { mailService } = request.services();
                const userCheckedIn = await userService.getUserById(request.params.id);
                if (( userCheckedIn[0].login !== request.payload.login) || ( userCheckedIn[0].password !== request.payload.password)){
                    await mailService.sendMails(request.payload);
                    await userService.editUser(request.params.id, request.payload);
                    return h.response('E-mail sent with modifications').code(201);
                }

                await userService.editUser(request.params.id, request.payload);
                return h.response('User Updated with success').code(201);
            }
        }
    },
    {
        method: 'POST',
        path: '/users/new',
        options: {
            tags: ['api'],
            validate: {
                payload : UserSchema
            },
            async handler(request, h) {
                const { mailService } = request.services();
                const { userService } = request.services();
                await userService.addUser(request.payload);
                await mailService.sendMails(request.payload);
                return h.response('User has been successfully adding').code(201);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/users/delete/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },
            async handler(request, h) {
                const { userService } = request.services();
                await userService.deleteUser(request.params.id);
                return h.response('User deleted with success').code(204);
            }
        }
    },
    {
        method: 'POST',
        path: '/auth/{login}/{password}',
        options: {
            tags: ['api'],
            validate: {
                params: {
                    login: Joi.string().required(),
                    password: Joi.string().required()
                }
            },
            async handler(request, h) {
                const { userService } = request.services();
                const answer = await userService.authUser(request.params.login, request.params.password);
                return h.response(answer);
            }
        }
    }
];
