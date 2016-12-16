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

describe('TodoController', function () {

    var request, response, testData;
    beforeEach(function () {

        // mock http request & response
        request = httpMocks.createRequest();
        response = httpMocks.createResponse();

        //set up a clean, fake db
        testData = [
            {
                "title": "Setup test site on different port.",
                "done": true,
                "meta": { "revision": 0, "created": 1479043435802, "version": 0 },
                "$loki": 1
            },
            {
                "title": "Finish the todo api",
                "meta": { "revision": 0, "created": 1479051068239, "version": 0 },
                "$loki": 2
            }];

        collectionStub =
            {
                data: testData,
                findOne: function (query) {
                    for (var i = 0; i < testData.length; i++) {
                        if (query.$loki === testData[i].$loki) {
                            return testData[i];
                        }
                    }
                },
                insert: function () { },
                update: function () { }
            };

        //todo: move loki mock to it's own module
        saveSpy = sinon.stub();
        getCollectionStub = sinon.stub().returns(collectionStub);

        lokiStub = function loki(filename) {
            this.loadDatabase = function (options, callback) {
                callback();
            };

            this.getCollection = getCollectionStub;
            this.save = saveSpy;
        }

        todo = proxy('../controllers/todo', { 'lokijs': lokiStub });
    })

    describe('findAll', function () {
        describe('when successful', function () {
            it('should return all items', function () {

                todo.findAll(request, response);
                var actual = response._getData();
                expect(actual).to.deep.equal(testData);
            });

            it('should return a 200 ok', function () {

                todo.findAll(request, response);
                expect(response.statusCode).to.equal(200);
            });
        });
        describe('when database fails', function () {
            it('calls next', function () {

                var expectedError = new Error('Failed to connect to database');
                getCollectionStub.throws(expectedError);

                var next = sinon.spy();
                todo.findAll(request, response, next);

                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            })
        });
    });

    describe('findById', function () {

        describe('when item is found', function () {

            beforeEach(function () {
                request._setParameter('id', 1);
            });

            it('should return 200 ok', function () {
                todo.findById(request, response);
                expect(response.statusCode).to.equal(200);
            });

            it('should only return the expected item', function () {
                todo.findById(request, response);
                var actual = response._getData();
                expect(actual).to.deep.equal(testData[0]);
            });
        });

        describe('when item is not found', function () {
            beforeEach(function () {
                request._setParameter('id', 0);
            });

            it('should return 404 not found', function () {
                todo.findById(request, response);
                expect(response.statusCode).to.equal(404);
            });
        });

        describe('when database fails', function () {
            it('should call next', function () {

                var expectedError = new Error('Failed to connect to database');
                getCollectionStub.throws(expectedError);

                var next = sinon.spy();
                todo.findById(request, response, next);

                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            })
        });
    });

    describe('insert', function () {
        describe('when successful', function () {

            var insertSpy;
            var body = { name: 'spy on the insert' };

            beforeEach(function () {

                request = httpMocks.createRequest({ body: body });
                insertSpy = sinon.stub(collectionStub, 'insert', function () {
                    return body;
                });
            });

            it('inserts to the database', function () {

                todo.insert(request, response);

                expect(insertSpy.calledWithExactly(body)).to.be.true;
                expect(insertSpy.calledOnce).to.be.true;
            });

            it('saves to the database', function () {
                todo.insert(request, response);
                expect(saveSpy.calledOnce).to.be.true;
            });

            it('returns the new todo item in the response body', function () {
                todo.insert(request, response);
                expect(response._getData()).to.deep.equal({ name: 'spy on the insert' });
            });

            it('returns 201 created', function () {
                todo.insert(request, response);
                expect(response.statusCode).to.equal(201);
            });

            it('includes a uri pointing to the new resource');
        });

        describe('when failed', function () {
            it('calls next', function () {
                var expectedError = new Error('Failed to save to database.');
                saveSpy.throws(expectedError);

                var next = sinon.spy();
                todo.insert(request, response, next);

                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            });
        });
    });

    describe('update', function () {
        describe('when item is found', function () {

            var updateSpy = sinon.spy();
            var postData = { title: 'Foo', done: 'true' };

            beforeEach(function () {

                request = httpMocks.createRequest({ body: postData });
                request._setParameter('id', 1);
                response = httpMocks.createResponse({ req: request });

                updateSpy = sinon.spy(collectionStub, 'update');
            });

            describe('when successful', function () {
                it('calls update', function () {
                    todo.update(request, response);
                    expect(updateSpy.calledOnce).to.be.true;
                });

                it('saves to the database', function () {
                    todo.update(request, response);
                    expect(saveSpy.calledOnce).to.be.true;
                });

                it('includes updated todo item in response body', function () {
                    todo.update(request, response);
                    expect(response._getData()).to.deep.equal(postData);
                });

                it('returns 200 ok', function () {
                    todo.update(request, response);
                    expect(response.statusCode).to.equal(200);
                });
            });

            describe('when failure', function () {
                it('calls next', function () {
                    var expectedError = new Error('Failed to save to database.');
                    saveSpy.throws(expectedError);

                    var next = sinon.spy();
                    todo.update(request, response, next);

                    expect(next.calledOnce).to.be.true;
                    expect(next.calledWith(expectedError)).to.be.true;
                });
            });
        });

        describe('when item is not found', function () {
            beforeEach(function () {
                request._setParameter('id', 0);
            });

            it('should return 404 not found', function () {
                todo.update(request, response);
                expect(response.statusCode).to.equal(404);
            });
        });
    });
});
