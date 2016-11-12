var express = require('express'),
    todo = require('./routes/todo');

var app = express();

app.get('/',
    function (request, response) {

        // API root returns info about the api itself
        var apiInfo = {
            Title: 'Todo API',
            _links: [
                { self: { href: '/' } },
                {
                    todo: [
                        { href: '/todo' },
                        {
                            href: '/todo/{id}',
                            templated: true
                        }
                    ]
                }
            ]
        };

        response.format({
            html: function () {
                var links = apiInfo._links[1].todo;
                var linksMarkup = '<ul>';

                for (var i = 0; i < links.length; i++) {

                    linksMarkup = linksMarkup + '<li>';
                    if (links[i].templated) {
                        linksMarkup += links[i].href;
                    } else {
                        linksMarkup += '<a href="' + links[i].href + '">' + links[i].href + '</a>';
                    }

                    linksMarkup += '</li>';
                }
                linksMarkup += '</ul>';

                response.send('<h3>' + apiInfo.Title + '</h3>' + linksMarkup);
            },

            json: function () {
                response.send(apiInfo);
            }
        });
    });

app.get('/todo', todo.findAll);
app.get('/todo/:id', todo.findById);

app.listen(1337,
    function () {
        console.log('Web api is listening on port 1337');
    });