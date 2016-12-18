exports.handle = function (error, request, response, next) {
    
    response.status(500);

    response.format({
        json: function () {
            response.send();
        },
        html: function () {
            response.render('error');
        }
    });

    next(error);
}