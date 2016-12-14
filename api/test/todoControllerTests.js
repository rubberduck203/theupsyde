var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http'),
    proxy = require('proxyquire'),
    sinon = require('sinon');

var todo = require('../controllers/todo');

var lokiStub,
    //We overwrite the stub later, specify the type so we get intellisense.
    saveSpy = sinon.stub(),
    getCollectionStub = sinon.stub();

describe('TodoController', function(){

    var req, res, testData;
    beforeEach(function(){

        // mock http request & response
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();

        //set up a clean, fake db
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

        collectionStub = 
        { 
            data : testData,     
            findOne : function(query){
                for (var i = 0; i < testData.length; i++){
                    if (query.$loki === testData[i].$loki){
                        return testData[i];
                    }
                }      
            },
            insert : function(){}
        };

        //todo: move loki mock to it's own module
        saveSpy = sinon.stub();
        getCollectionStub = sinon.stub().returns(collectionStub);

        lokiStub = function loki(filename){
            this.loadDatabase = function(options, callback){
                callback();
            };
            
            this.getCollection = getCollectionStub;
            this.save = saveSpy;
        }

        todo = proxy('../controllers/todo', {'lokijs': lokiStub});
    })

    describe('findAll', function(){
        describe('when successful', function(){
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
        describe('when database fails', function(){
            it('calls next', function(){

                var expectedError = new Error('Failed to connect to database');
                getCollectionStub.throws(expectedError);

                var next = sinon.spy();
                todo.findAll(req, res, next);
                
                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            })
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

        describe('when database fails', function(){
            it('should call next', function(){

                var expectedError = new Error('Failed to connect to database');
                getCollectionStub.throws(expectedError);

                var next = sinon.spy();
                todo.findById(req, res, next);

                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            })
        });
    });

    describe('insert', function(){
        describe('when successful', function(){

            var insertSpy;
            var body = {name: 'spy on the insert'};

            beforeEach(function(){

                req = httpMocks.createRequest({body: body});
                insertSpy = sinon.stub(collectionStub, 'insert', function(){
                    return body;
                });
            });

            it('inserts to the database', function(){

                todo.insert(req, res);

                expect(insertSpy.calledWithExactly(body)).to.be.true;
                expect(insertSpy.calledOnce).to.be.true;
            });

            it('saves to the database',function(){
                todo.insert(req, res);
                expect(saveSpy.calledOnce).to.be.true;
            });

            it('returns the new todo item in the response body', function(){
                todo.insert(req, res);
                expect(res._getData()).to.deep.equal({name: 'spy on the insert'});
            });

            it('returns 201 created', function(){
                todo.insert(req, res);
                expect(res.statusCode).to.equal(201);
            });

            it('includes a uri pointing to the new resource');
        });

        describe('when failed', function(){
            it('calls next', function(){
                var expectedError = new Error('Failed to save to database.');
                saveSpy.throws(expectedError);
                
                var next = sinon.spy();
                todo.insert(req, res, next);
                
                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            });
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
