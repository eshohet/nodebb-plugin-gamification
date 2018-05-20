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
            (stats, next) => {
                const xp = algorithm.getExperienceFromStats(stats);
                const lvl = Math.floor(algorithm.getLevelFromExperience(xp));
                const xpNextLvl = algorithm.getExperienceFromLevel(lvl + 1);
                const lvlXp = algorithm.getExperienceFromLevel(lvl);
                const lvlProgress = (xp - lvlXp) / (xpNextLvl - lvlXp) * 100;
                next(null, {
                    xp, lvl, xpNextLvl, lvlXp, lvlProgress
                });
            },
        ], (error, results) => {
            postData.xp = results.xp;
            postData.lvl = results.lvl;
            postData.xpNextLvl = results.xpNextLvl;
            postData.lvlProgress = results.lvlProgress;
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
