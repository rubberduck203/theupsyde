var handlebars = require('handlebars');
var fs = require('fs');

exports.index = function(apiInfo, afterRenderingComplete){
    fs.readFile('./views/root.hbs', function(err, data){
        if (err){
            console.log(err);
            return;
        }

        var html = renderToString(data.toString(), apiInfo);
        //todo: return a promise instead of passing the callback
        afterRenderingComplete(html);
    });
}

function renderToString(source, data) {
  var template = handlebars.compile(source);
  var outputString = template(data);
  return outputString;
}
