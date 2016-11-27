var loki = require('lokijs'),
    db = new loki('todo.json');

/*
    todo: pass back html when requested via response.render()
*/ 

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
        if (!item) {
            response.sendStatus(404);
        }
        response.send(item);
    });
}