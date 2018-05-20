(function (Algorithm) {
    'use strict';

    const async = require('async'),
        database = require('./database');

    Algorithm.getExperienceFromStats = (stats, next) => {
        next(null, 0.5 * Math.sqrt(
            (stats['postcount'] || 0) +
            (5 * stats['topiccount'] || 0) +
            (25 * stats['reputation'] || 0)
        ));
    };

    Algorithm.getLevelFromExperience = (xp, next) => {
        console.log(xp);
        next(null, Math.floor(xp / 1000));
    };

})(module.exports);
