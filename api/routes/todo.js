var loki = require('lokijs'),
    db = new loki('todo.json');

exports.index = function(request, response, next) {

    db.loadDatabase({}, function(){
        var data = db.getCollection('todo').data;
        response.send(data);
    })
}


/* 
    What I would like to have is a `route` middleware which delegates to a `todoJson` and `todoHtml` middleware.
    I think that beyond this level, there probably isn't a need to request/response around,
    but rather pass around domain types instead.
*/ 