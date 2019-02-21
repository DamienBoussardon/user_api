'use strict';

exports.up = function (knex, Promise) {
    return knex
        .schema
        .createTable( 'users', ( usersTable ) => {

            usersTable.increments();
            usersTable.string( 'login', 50 ).notNullable();
            usersTable.string( 'password', 50 ).notNullable();
            usersTable.string( 'email', 250 ).notNullable();
            usersTable.string( 'firstname', 125 ).notNullable();
            usersTable.string( 'lastname', 125 ).notNullable();
            usersTable.string( 'company', 125 ).notNullable();
            usersTable.string( 'function', 125 ).notNullable();


        });

};

exports.down = function (knex, Promise) {
    return knex
        .schema
        .dropTableIfExists( 'users' );
};
