var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.set('view engine', 'hbs');

var auth = require('http-auth');
var basic = auth.basic({file: __dirname + "/data/users.htpasswd"});
// uncomment to password protect the whole api
// app.use(auth.connect(basic));

// use this as middleware just for routes we want
var requireAuth = auth.connect(basic);

// require authentication for all post requests
app.post('*', requireAuth);

var root = require('./controllers/root'),
    todo = require('./controllers/todo');    

app.get('/', root.index);
app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);
app.post('/todo', todo.insert);
app.post('/todo/:id', todo.update);

// Order is important here, the error handler needs to be after all the routes for it to fire correctly.
var errorHandler = require('./middleware/errorHandler');
app.use(errorHandler.handle);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });

