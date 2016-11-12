exports.findAll = function(request, response) {

    var data = [{ name: 'Hello' }, { name: 'World' }];

    response.format({
        html: function () {
            response.write('<ul>');
            for (var i = 0; i < data.length; i++) {
                response.write('<li>' + data[i].name + '</li>');
            }
            response.write('</ul>');

            response.send();
        },

        json: function() {
            response.send(data);
        }
    });
}

exports.findById = function(request, response) {
    response.send({ id: request.params.id, name: 'Hello', description: 'Awesome sauce!' });
}