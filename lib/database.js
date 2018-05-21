(function (Database) {
    'use strict';

    const nodebb = require('./nodebb');

    Database.getStats = (uid, done) => {
        nodebb.user.getUserFields(uid, ['postcount', 'topiccount', 'reputation'], done);
    };

    Database.multiGetStats = (uids, done) => {
        nodebb.user.getUsersWithFields(uids, ['postcount', 'topiccount', 'reputation'], -1, done);
    };

})(module.exports);
