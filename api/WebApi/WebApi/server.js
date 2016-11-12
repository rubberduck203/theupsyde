var express = require('express'),
    todo = require('./routes/todo');

var app = express();

app.get('/',
    function (request, response) {

        if (request.accepts('html')) {
            response.type('html');
            response.write('<h3>Todo API</h3');
            response.write('<ul><li>');
            response.write('<a href="/todo">/todo</a>');
            response.write('</li><li>');
            response.write('/todo/{id}');
            response.write('</li></ul>');
            response.send();
            return;
        }

        if (request.accepts('json')) {
            response.send([
                {
                    'Title': 'Todo API',
                    '_links': {
                        'self': { 'href': '/' },
                        'todo': [{ 'href': '/todo' },
                            {
                                'href': '/todo/{id}',
                                'templated': true
                            }]
                    }
                }
            ]);
            return;
        }

    });

app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });