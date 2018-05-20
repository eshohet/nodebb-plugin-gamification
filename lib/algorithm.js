(function (Algorithm) {
    'use strict';

    const async = require('async'),
        database = require('./database');

    Algorithm.getExperienceFromStats = (stats, next) => {
        next(null,
            (parseInt(stats['postcount']) || 0) +
            (5 * parseInt(stats['topiccount']) || 0) +
            (10 * parseInt(stats['reputation']) || 0)
        );
    };

    Algorithm.getLevelFromExperience = (xp, next) => {
        next(null, (0.5 * Math.sqrt(xp)) + 1);
    };

})(module.exports);
