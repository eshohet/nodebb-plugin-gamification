/* globals app, $, socket */

$(document).ready(() => {
    socket.on(`event:gamification`, (data) => {
        const newLevel = data.lvl;
        bootbox.dialog({
            backdrop: true,
            onEscape: true,
            size: 'small',
            title: '<div class="text-center">You just leveled up!</div>',
            message: '<div class="text-center">' +
            '<i style="font-size: 200px; color: gold;" class="fa fa-trophy"></i>' +
            '<h3>Level ' + newLevel + '</h3>' +
            '</div>'
        });
    });
});
