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

exports.findById = function (id) {
    var deferred = Q.defer();

    db.loadDatabase({}, function () {
        try {
            var item = db.getCollection('todo')
                .findOne({ '$loki': id * 1 });

            deferred.resolve(item);
        }
        catch (err) {
            deferred.reject(err);
        }
    });

    return deferred.promise;
}

exports.update = function (id, item) {
    var deferred = Q.defer();

    db.loadDatabase({}, function () {
        try {
            var items = db.getCollection('todo');
            var doc = items.findOne({ '$loki': id * 1 });

            if (!doc) {
                deferred.resolve(null);
                return deferred.promise;
            }

            doc.title = item.title;
            doc.done = item.done;

            items.update(doc);
            db.save();

            deferred.resolve(item);

        } catch (err) {
            deferred.reject(err);
        }
    });

    return deferred.promise;
}

exports.insert = function (item) {
    var deferred = Q.defer();

    try {
        db.loadDatabase({}, function () {
            var doc = db.getCollection('todo').insert(item);
            db.save();
            deferred.resolve(doc);
        });
    } catch (err) {
        deferred.reject(err);
    }

    return deferred.promise;
}