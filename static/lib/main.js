"use strict";

/* globals app, $ */

$(window).on('action:composer.post.new', function(event, data) {
    console.log(data);  // to inspect what is passed back by NodeBB
});
