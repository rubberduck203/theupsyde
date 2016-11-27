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
        //todo: move loki mock to it's own module
        var lokiStub = function loki(filename){
            this.loadDatabase = function(options, callback){
                callback();
            };
            
            this.getCollection = function(collectionName){
                 return  { 
                     data : testData,     
                     findOne : function(query){
                         for (var i = 0; i < testData.length; i++){
                             if (query.$loki === testData[i].$loki){
                                 return testData[i];
                             }
                         }
                     }   
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

    describe('findById', function(){

        describe('when item is found', function(){
        
            beforeEach(function(){
                req._setParameter('id', 1);
            });

            it('should return 200 ok', function(){
                todo.findById(req, res);
                expect(res.statusCode).to.equal(200);
            });

            it('should only return the expected item', function(){       
                todo.findById(req, res);
                var actual = res._getData();
                expect(actual).to.deep.equal(testData[0]);
            });
        });

        describe('when item is not found', function(){
            beforeEach(function(){
                req._setParameter('id', 0);
            });

            it('should return 404 not found', function(){
                todo.findById(req, res);
                expect(res.statusCode).to.equal(404);
            });
        });
    });

    describe('insert', function(){
        describe('when successful', function(){
            it('saves to the database');
            it('returns the new todo item in the response body');
            it('includes a uri pointing to the new resource');
            it('returns 201 created');
        });

        describe('when failed', function(){
            it('returns a 500 server error');
        });
    });

    describe('update', function(){
        describe('when item is found', function(){
            describe('when successful', function(){
                it('saves to the database');
                it('includes updated todo item in response body');
                it('returns 200 ok');
            });

            describe('when failure', function(){
                it('returns 500 server error');
            });
        });

        describe('when item is not found', function(){
            it('returns 404 not found');
        })
    });
});
