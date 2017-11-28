var express   = require('express'),
    router    = express.Router(),
    jade      = require('jade');


module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function(req, res, next){
    const templ = jade.compileFile('teml');

    const text = templ({
        name : 'Pavel'
    });
    console.log(text);

    res.render('index');
});