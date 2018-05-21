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
        const uids = payload.posts.map(post => post.uid);
        async.waterfall([
            async.apply(database.multiGetStats, uids),
            (stats, next) => {
                const detailedStats = stats.map((stat) => {
                    const xp = algorithm.getExperienceFromStats(stat);
                    const lvl = Math.floor(algorithm.getLevelFromExperience(xp));
                    const xpNextLvl = algorithm.getExperienceFromLevel(lvl + 1);
                    const lvlXp = algorithm.getExperienceFromLevel(lvl);
                    const lvlProgress = (xp - lvlXp) / (xpNextLvl - lvlXp) * 100;
                    return {
                      xp, lvl, xpNextLvl, lvlXp, lvlProgress
                    };
                });
                const combine = (post, stats, index) => {
                    post.xp = stats[index].xp;
                    post.lvl = stats[index].lvl;
                    post.xpNextLvl = stats[index].xpNextLvl;
                    post.lvlProgress = stats[index].lvlProgress;
                    return post;
                };

                payload.posts = payload.posts.map((post, index) => combine(post, detailedStats, index));

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

    Filter.userAccount  = (data, next) => {
        database.getStats(data.userData.uid, (error, stats) => {
            const xp = algorithm.getExperienceFromStats(stats);
            const lvl = Math.floor(algorithm.getLevelFromExperience(xp));
            data.userData.lvl = lvl;
            next(error, data);
        });
    }

})(module.exports);
