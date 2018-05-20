(function (Database) {
    'use strict';

    const async = require('async');

    const nodebb    = require('./nodebb'),
        constants = require('./constants');

    const db   = nodebb.db;

    Database.getPoints = function (uid, done) {
        db.sortedSetScore(constants.NAMESPACE, uid, done);
    };

    Database.incrementBy = function (uid, increment, done) {
        db.sortedSetIncrBy(constants.NAMESPACE, increment, uid, done);
    };

})(module.exports);
