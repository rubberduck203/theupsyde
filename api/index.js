var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.set('view engine', 'hbs');

var root = require('./routes/root'),
    todo = require('./routes/todo');    

app.get('/', root.index);
app.get('/todo', todo.findAll);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });

