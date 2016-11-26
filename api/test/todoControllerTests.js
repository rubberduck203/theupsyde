var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http');


var todo = require('../routes/todo');
var proxy = require('proxyquire');
var dbStub; 

describe('TodoController', function(){

    beforeEach(function(){
        dbStub = {
            loadDatabase : function(collectionName){
                 return  { 
                     data : function(){
                         return { name: 'hello'}
                     }        
                }
            }
        };
        
        todo = proxy('../routes/todo', {'lokijs': dbStub});
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
