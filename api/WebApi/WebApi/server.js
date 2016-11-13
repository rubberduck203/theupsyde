var express = require('express'),
    todo = require('./routes/todo'),
    root = require('./routes/root'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/', root.index);

app.get('/todo', todo.findAll);
app.post('/todo', todo.insert);

app.get('/todo/:id', todo.findById);
app.post('/todo/:id', todo.update);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });