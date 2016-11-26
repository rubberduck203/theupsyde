var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http');


var todo = require('../routes/todo');
var proxy = require('proxyquire'); 

describe('TodoController', function(){


    beforeEach(function(){
       var dbStub = {
            loadDatabase : function(collectionName){
                 return  { 
                     data : { name: 'hello'}        
                }
            }
        };

        function loki(filename){
            this.loadDatabase = dbStub.loadDatabase;
        }

        var lokiStub = loki;

        todo = proxy('../routes/todo', {'lokijs': lokiStub});
    })

    describe('index', function(){
        it('should return api info', function(){

            var req = httpMocks.createRequest(),
                res = httpMocks.createResponse();

            todo.index(req, res);
            expect(res._getData()).to.deep.equal({name: 'hello'});
        });

        it('should return a 200 ok', function(){
            var req = httpMocks.createRequest(),
                res = httpMocks.createResponse();

            todo.index(req, res);

            expect(res.statusCode).to.equal(200);
        });
    });
});
