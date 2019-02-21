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
            return await userService.getAllUsers();
        }

    },
    {
        method: 'GET',
        path: '/user/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: {
                    id: Joi.number().required()
                }
            },
            async handler(request, h){
                const { userService } = request.services();
                return await userService.getUserById(request.params.id);

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
                return await userService.generateUser();
            }
        }
    },
    {
        method: 'PUT',
        path: '/edit-user/{id}',
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
                await userService.editUser(request.params.id, request.payload);
                return 'User Updated with success';
            }
        }
    },
    {
        method: 'POST',
        path: '/creation-user',
        options: {
            tags: ['api'],
            validate: {
                payload : UserSchema
            },
            async handler(request, h) {
                console.log(request.payload);
                const { userService } = request.services();
                return await userService.addUser(request.payload);
                //return 'User created with success';
            }
        }
    },
    {
        method: 'DELETE',
        path: '/delete/{id}',
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
                return 'User deleted with success';
            }
        }
    }
];
