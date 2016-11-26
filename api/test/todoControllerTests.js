var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http'),
    proxy = require('proxyquire');

var todo = require('../routes/todo');

describe('TodoController', function(){

    beforeEach(function(){

        var lokiStub = function loki(filename){
            this.loadDatabase = function(options, callback){
                callback();
            };
            
            this.getCollection = function(collectionName){
                 return  { 
                     data : { name: 'hello'}        
                }
            }
        }

        todo = proxy('../routes/todo', {'lokijs': lokiStub});
    })

    describe('index', function(){
        it('should return api info', function(){

            var req = httpMocks.createRequest(),
                res = httpMocks.createResponse();

            todo.index(req, res);

            var actual = res._getData();
            expect(actual).to.deep.equal({name: 'hello'});
        });

        it('should return a 200 ok', function(){
            var req = httpMocks.createRequest(),
                res = httpMocks.createResponse();

            todo.index(req, res);

            expect(res.statusCode).to.equal(200);
        });
    });
});
