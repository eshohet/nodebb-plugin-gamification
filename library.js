"use strict";

const views = require('./lib/views'),
	filters = require('./lib/filters'),
	plugin = {};

plugin.init = function(params, callback) {
	const router = params.router,
		hostMiddleware = params.middleware,
		hostControllers = params.controllers;

	router.get('/admin/plugins/gamification', hostMiddleware.admin.buildHeader, views.renderAdminPage);
	router.get('/api/admin/plugins/gamification', views.renderAdminPage);

	callback();
};

plugin.filters = filters;

module.exports = plugin;
