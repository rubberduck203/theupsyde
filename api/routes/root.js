var ApiInfo = require('../ApiInfo');

exports.index = function (request, response) {

    response.format({
        json: function(){
            response.send(new ApiInfo());
            return;
        }
    });
}