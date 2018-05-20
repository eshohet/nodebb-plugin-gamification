'use strict';
/* globals $, app, socket */

define('admin/plugins/gamification', ['settings'], function(Settings) {

	const ACP = {};

	ACP.init = function() {
		Settings.load('gamification', $('.gamification-settings'));

		$('#save').on('click', function() {
			Settings.save('gamification', $('.gamification-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'gamification-saved',
					title: 'Settings Saved',
					message: 'Please reload your NodeBB to apply these settings',
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	};

	return ACP;
});
