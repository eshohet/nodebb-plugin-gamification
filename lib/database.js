(function (Database) {
    'use strict';

    const async = require('async');

    const nodebb = require('./nodebb'),
        constants = require('./constants');

    const db = nodebb.db;

    Database.getStats = (uid, done) => {
        nodebb.user.getUserFields(uid, ['postcount', 'topiccount', 'reputation'], done);
    };

    Database.getPoints = (uid, done) => {
        db.sortedSetScore(constants.NAMESPACE, uid, done);
    };

    Database.incrementBy = (uid, increment, done) => {
        db.sortedSetIncrBy(constants.NAMESPACE, increment, uid, done);
    };

})(module.exports);
