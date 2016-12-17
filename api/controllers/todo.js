var loki = require('lokijs'),
    db = new loki('todo.json');

//todo: finish removeing loki from this module

var q = require('q');
var todoDb = require('../repositories/todoRepository');

/*
    todo: pass back html when requested via response.render()
*/

exports.findAll = function (request, response, next) {
    return todoDb.findAll()
        .then(function (data) {
            response.send(data);
        }).catch(function (err) {
            next(err);
        });
}

exports.findById = function (request, response, next) {

    return todoDb.findById(request.params.id)
        .then(function (data) {
            if (!data) {
                response.sendStatus(404);
                return;
            }

            response.send(data);
        }).catch(function (err) {
            next(err);
        });
}

exports.insert = function (request, response, next) {
    db.loadDatabase({}, function () {
        try {
            var doc = db.getCollection('todo')
                .insert(request.body);
            db.save();

            response.status(201)
                .send(doc);
        }
        catch (err) {
            next(err);
        }
    });
}

exports.update = function (request, response, next) {

    return todoDb.update(request.params.id, request.body)
        .then((item) => {

            if (!item) {
                response.sendStatus(404);
                return;
            }

            response.send(item);

        }).catch(function(err) {
            next(err);
        });
}