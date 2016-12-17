var q = require('q');
var todoDb = require('../repositories/todoRepository');

/*
    todo: pass back html when requested via response.render()
*/

exports.findAll = function (request, response, next) {
    return todoDb.findAll()
        .then(function (data) {
            response.format({
                json: () => response.send(data),
                html: () => response.render('todo', data)
            });
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

    return todoDb.insert(request.body)
        .then((result) => {
            response.status(201).send(result);
        }).catch((err) => {
            next(err);
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

        }).catch(function (err) {
            next(err);
        });
}