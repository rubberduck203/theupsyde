var express = require('express'),
    todo = require('./routes/todo'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.get('/', todo.index);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });