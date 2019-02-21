'use strict';

const userSchema = require('../schemas/user-schema');

const { Model } = require('objection');

module.exports = class User extends Model{
    static get tableName() {
        return 'users';
    }
    static get joiSchema() {
        return userSchema;
    }
};
