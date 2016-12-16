var loki = require('lokijs'),
    db = new loki('todo.json');

var Q = require('q');

exports.findAll = function () {
    var deferred = Q.defer();

    db.loadDatabase({}, function () {

        try {
            deferred.resolve(db.getCollection('todo').data);
        }
        catch (err) {
            deferred.reject(err);
        }
    });

    return deferred.promise;
}