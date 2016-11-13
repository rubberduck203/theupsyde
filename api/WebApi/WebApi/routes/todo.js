var loki = require('lokijs'),
    db = new loki('todo.json');

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
        function() {
            var items = db.getCollection('todo');
            //request params is a string, must be int to lookup properly
            var item = items.findOne({ '$loki': request.params.id * 1 });
            response.send(item);
        });
}