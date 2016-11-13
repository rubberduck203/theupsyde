exports.findAll = function (request, response) {
    var loki = require('lokijs'),
        db = new loki('todo.json');

    db.loadDatabase({}, function() {
        var data = db.getCollection('todo').data;
        console.log(data);

        response.format({
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

exports.findById = function(request, response) {
    response.send({ id: request.params.id, name: 'Hello', description: 'Awesome sauce!' });
}