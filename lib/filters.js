(function (Filter) {
    'use strict';

    const async = require('async'),
        database = require('./database'),
        algorithm = require('./algorithm');

    /**
     * Hook to render single posted post
     * @param postData {object} Fields: {pid, uid, tid, content, timestamp, reputation, votes, editor, edited, deleted, cid}
     * @param callback {function}
     */
    Filter.postGet = (postData, callback) => {
        async.waterfall([
            async.apply(database.getStats, postData.uid),
            async.apply(algorithm.getExperienceFromStats),
            (xp, next) => {
                algorithm.getLevelFromExperience(xp, (err, lvl) => {
                   next(null, {xp, lvl});
                });
            }
        ], (error, results) => {
            postData.xp = results.xp;
            postData.lvl = Math.floor(results.lvl);
            postData.lvlProgress = (Math.ceil(results.lvl) - results.lvl) * 100;
            callback(error, postData);
        });
    };

    /**
     * Hook to render topic thread
     * @param payload {object} Fields: {posts: posts, uid: uid}
     * @param callback {function}
     */
    Filter.postGetPosts = (payload, callback) => {
        async.map(payload.posts, Filter.postGet, (error, results) => {
            if (error) {
                return callback(error);
            }
            payload.posts = results;
            callback(null, payload);
        });
    };

    Filter.addAdminNavigation = (header, callback) => {
        header.plugins.push({
            route: '/plugins/gamification',
            icon: 'fa-tint',
            name: 'Gamification'
        });

        callback(null, header);
    };

})(module.exports);
