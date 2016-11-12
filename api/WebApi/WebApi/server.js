var express = require('express'),
    todo = require('./routes/todo');

var app = express();

app.get('/',
    function (request, response) {

        response.format({
            html: function() {
                response.send('<h3>Todo API</h3><ul>' +
                    '<li><a href="/todo">/todo</a></li>' +
                    '<li>/todo/{id}</li></ul>');
            },

            json: function() {
                response.send([
                    {
                        'Title': 'Todo API',
                        '_links': {
                            'self': { 'href': '/' },
                            'todo': [
                                { 'href': '/todo' },
                                {
                                    'href': '/todo/{id}',
                                    'templated': true
                                }
                            ]
                        }
                    }
                ]);
            }
        });
    });

app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });