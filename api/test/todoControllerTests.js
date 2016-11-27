var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http'),
    proxy = require('proxyquire');

var todo = require('../controllers/todo');

describe('TodoController', function(){

    var req, res, testData;
    beforeEach(function(){
        testData = [
            {
                "title":"Setup test site on different port.",
                "done":true,
                "meta":{"revision":0,"created":1479043435802,"version":0},
                "$loki":1
            },
            {
                "title":"Finish the todo api",
                "meta":{"revision":0,"created":1479051068239,"version":0},
                "$loki":2
            }];

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
                     data : testData        
                }
            }
        }

        todo = proxy('../controllers/todo', {'lokijs': lokiStub});
    })

    describe('findAll', function(){
        it('should return all items', function(){

            todo.findAll(req, res);
            var actual = res._getData();
            expect(actual).to.deep.equal(testData);
        });

        it('should return a 200 ok', function(){
            
            todo.findAll(req, res);
            expect(res.statusCode).to.equal(200);
        });
    });
});
