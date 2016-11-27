var loki = require('lokijs'),
    db = new loki('todo.json');

exports.findAll = function(request, response) {

    db.loadDatabase({}, function(){
        var data = db.getCollection('todo').data;
        response.send(data);
    })
}

exports.findById = function(request, response){
    db.loadDatabase({}, function(){
        var items = db.getCollection('todo');
         //request params is a string, must be int to lookup properly
        var item = items.findOne({'$loki': request.params.id * 1});
        response.send(item);
    });
}

/*
    //todo: pass back html when requested

    What I would like to have is a `route` middleware which delegates to a `todoJson` and `todoHtml` middleware.
    I think that beyond this level, there probably isn't a need to request/response around,
    but rather pass around domain types instead.
*/ 