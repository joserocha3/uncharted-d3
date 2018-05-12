import {Accounts} from 'meteor/accounts-base';

Accounts.config({forbidClientAccountCreation: true})

if (Meteor.users.find().count() === 0) {
    Accounts.createUser({
        username: 'admin',
        email: 'contact@nomoreanalog.com',
        password: 'fL5yvmb3KgxXmUmk',
        profile: {
            first_name: 'admin',
            last_name: 'admin',
            company: 'NoMoreAnalog',
        }
    })
}