(function (Views) {
    'use strict';

    Views.renderAdminPage = (req, res, next) => {
        res.render('admin/plugins/gamification',  {});
    }

})(module.exports);
