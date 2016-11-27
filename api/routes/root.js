var ApiInfo = require('../ApiInfo');

exports.index = function (request, response) {

    response.format({
        json: function(){
            response.send(new ApiInfo());
            return;
        },
        html: function(){
            var htmlController = require('../routes/html/root');
            htmlController.index(new ApiInfo(), function(html){
                response.send(html);
            });
        }
    });
}