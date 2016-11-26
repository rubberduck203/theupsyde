var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http'),
    proxy = require('proxyquire');

var todo = require('../routes/todo');

describe('TodoController', function(){

    var req, res;

    beforeEach(function(){
        // mock http request & response
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();

        // set up a clean db stub
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

    describe('findAll', function(){
        it('should return all items', function(){

            todo.findAll(req, res);
            var actual = res._getData();
            expect(actual).to.deep.equal({name: 'hello'});
        });

        it('should return a 200 ok', function(){
            
            todo.findAll(req, res);
            expect(res.statusCode).to.equal(200);
        });
    });
});
