var express   = require('express'),
    router    = express.Router(),
    jade      = require('jade');

const views_dir = './app/views/';

const   car = jade.compileFile(views_dir + 'car_template.jade');

module.exports = function (app) {
    app.use('/', router);
};

router.get('/', function(req, res, next){
    res.render('index');
});

router.get('/carTemplate',function(req, res, next){
    res.status(200).send(car());
});

router.get('/orderTemplate',function(req, res, next){
    res.status(200).send(null);
});