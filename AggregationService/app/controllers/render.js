var express   = require('express'),
    router    = express.Router(),
    jade      = require('jade');

const views_dir = './app/views/';

const   car     = jade.compileFile(views_dir + 'car_template.jade'),
        err     = jade.compileFile(views_dir + 'error_template.jade');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function(req, res, next){
    res.render('index');
});

router.get('/carTemplates',function(req, res, next){
    data = {
        successfully    : car(),
        error           : err()
    }
    res.status(200).send(data);
});

router.get('/orderTemplate',function(req, res, next){
    res.status(200).send(null);
});