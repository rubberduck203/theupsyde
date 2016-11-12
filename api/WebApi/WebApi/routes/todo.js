exports.findAll = function(request, response) {
    response.send([{ name: 'Hello' }, { name: 'World' }]);
}

exports.findById = function(request, response) {
    response.send({ id: request.params.id, name: 'Hello', description: 'Awesome sauce!' });
}