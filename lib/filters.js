(function (Filter) {
    'use strict';

    const async      = require('async'),
        database   = require('./database');

    /**
     * Hook to render single posted post
     * @param postData {object} Fields: {pid, uid, tid, content, timestamp, reputation, votes, editor, edited, deleted, cid}
     * @param callback {function}
     */
    Filter.postGet = function (postData, callback) {
        database.getPoints(postData.uid, function (error, points) {
            if (error) {
                return callback(error);
            }
            postData.points = points || 0;
            callback(null, postData);
        });
    };

    /**
     * Hook to render topic thread
     * @param payload {object} Fields: {posts: posts, uid: uid}
     * @param callback {function}
     */
    Filter.postGetPosts = function (payload, callback) {
        console.log(`postGetPosts`, payload);
        async.map(payload.posts, function (post, next) {
            database.getPoints(post.uid, function (error, points) {
                if (error) {
                    return next(error);
                }
                post.points = points || 0;
                next(null, post);
            });
        }, function (error, results) {
            if (error) {
                return callback(error);
            }
            payload.posts = results;
            callback(null, payload);
        });
    };

    Filter.addAdminNavigation = function(header, callback) {
        header.plugins.push({
            route: '/plugins/gamification',
            icon: 'fa-tint',
            name: 'Gamification'
        });

        callback(null, header);
    };

})(module.exports);
