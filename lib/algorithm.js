(function (Algorithm) {
    'use strict';

    const async = require('async'),
        database = require('./database');

    Algorithm.getExperienceFromStats = (stats, next) => {
        console.log(stats);
        next(null, 0.5 * Math.sqrt(
            stats['postcount'] || 0 +
            stats['topiccount'] || 0+
            stats['followerCount'] || 0+
            stats['joindate'] || 0 +
            stats['reputation'] || 0
        ));
    };

})(module.exports);
