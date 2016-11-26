var ApiInfo = require('../ApiInfo');

exports.index = function (request, response) {

    response.send(new ApiInfo);
}