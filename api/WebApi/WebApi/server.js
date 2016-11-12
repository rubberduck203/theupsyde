var express = require('express'),
    todo = require('./routes/todo'),
    root = require('./routes/root');

var app = express();

app.get('/', root.index);

app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });