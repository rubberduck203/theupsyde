var loki = require('lokijs'),
    db = new loki('todo.json');

//todo: add error handling

exports.findAll = function (request, response) {

    db.loadDatabase({}, function() {
        var data = db.getCollection('todo').data;

        response.format({
            //todo: use a templating library
            html: function () {
                response.write('<ul>');
                for (var i = 0; i < data.length; i++) {
                    response.write('<li>' + data[i].title + '</li>');
                }
                response.write('</ul>');

                response.send();
            },

            json: function () {
                response.send(data);
            }
        });
    });
}

exports.findById = function (request, response) {

    db.loadDatabase({},
        function () {
            var items = db.getCollection('todo');
            //request params is a string, must be int to lookup properly
            var item = items.findOne({ '$loki': request.params.id * 1 });
            response.send(item);
        });
}

exports.update = function (request, response) {
    db.loadDatabase({},
        function () {
            var items = db.getCollection('todo');

            var doc = items.findOne({ '$loki': request.params.id * 1 });
            doc.title = request.body.title;
            doc.done = request.body.done;

            items.update(doc);
            db.save();

            response.send(doc);
        }
    );
}

exports.insert = function (request, response) {
    //todo: document
    //todo: remove the lokijs stuff from the repsonse
    //todo: return a url to the new resource
    db.loadDatabase({},
        function() {
            var items = db.getCollection('todo');

            var doc = items.insert(request.body);
            db.save();

            response.send(doc);
        });
}