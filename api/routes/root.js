var ApiInfo = require('../ApiInfo');

exports.index = function (request, response) {

    response.format({
        json: function(){
            response.send(new ApiInfo());
        },
        html: function(){
            response.render('root', new ApiInfo);
        }
    });
}