var express = require('express');
var app = express();

app.get('/',
    function(request, response) {
        response.send('Hello World');
    });

app.listen(1337,
    function() {
        console.log('Web api is listening on port 1337');
    });