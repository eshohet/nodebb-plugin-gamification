(function (Filter) {
    'use strict';

    const async = require('async'),
        database = require('./database'),
        algorithm = require('./algorithm'),
        constants = require('./constants'),
        nodebb = require('./nodebb');

    /**
     * Hook to render single posted post
     * @param postData {object} Fields: {pid, uid, tid, content, timestamp, reputation, votes, editor, edited, deleted, cid}
     * @param callback {function}
     */
    Filter.postGet = (postData, callback) => {
        async.waterfall([
            async.apply(database.getStats, postData.uid),
            (stats, next) => {
                next(null, algorithm.getInfoFromStats(stats));
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
        const uids = payload.posts.map(post => post.uid);
        async.waterfall([
            async.apply(database.multiGetStats, uids),
            (stats, next) => {
                const detailedStats = stats.map((stat) => {
                    return algorithm.getInfoFromStats(stat);
                });
                const combine = (post, stats) => {
                    if (post) {
                        post.xp = stats.xp;
                        post.lvl = stats.lvl;
                        post.xpNextLvl = stats.xpNextLvl;
                        post.lvlProgress = stats.lvlProgress;
                    }
                    return post;
                };

                payload.posts = payload.posts.map((post, index) => combine(post, detailedStats[index]));

                next(null, payload);

            }
        ], callback);
    };

    Filter.addAdminNavigation = (header, callback) => {
        header.plugins.push({
            route: '/plugins/gamification',
            icon: 'fa-tint',
            name: 'Gamification'
        });

        callback(null, header);
    };

    Filter.userAccount = (data, next) => {
        database.getStats(data.userData.uid, (error, stats) => {
            const xp = algorithm.getExperienceFromStats(stats);
            const lvl = Math.floor(algorithm.getLevelFromExperience(xp));
            data.userData.lvl = lvl;
            next(error, data);
        });
    };

    Filter.postCreate = (data, next) => {
        const uid = data.post.uid;
        async.waterfall([
            async.apply(database.getStats, uid),
            (stats, next) => {

                const xp = algorithm.getExperienceFromStats(stats) + constants.POSTXP;
                const currentLvl = Math.floor(algorithm.getLevelFromExperience(xp));
                const priorXp = xp - constants.POSTXP;
                const priorLvl = Math.floor(algorithm.getLevelFromExperience(priorXp));
                if (priorLvl + 1 === currentLvl) {
                    nodebb.socketIndex.in('uid_' + uid).emit('event:gamification', {
                        lvl: currentLvl
                    });
                }
                next();
            }
        ], (error, results) => {
            next(error, data);
        });
    }
})(module.exports);
