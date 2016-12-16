var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http'),
    proxy = require('proxyquire'),
    sinon = require('sinon'),
    sinonAsPromised = require('sinon-as-promised');

var todo = require('../controllers/todo');

var lokiStub,
    //We overwrite the stub later, specify the type so we get intellisense.
    saveSpy = sinon.stub(),
    getCollectionStub = sinon.stub();

describe('TodoController', ()=> {

    var repoStub;
    var request, response, testData;
    beforeEach(()=> {

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
                insert: ()=> { },
                update: ()=> { }
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

        var findAll = sinon.stub().resolves(testData);
        var findById = sinon.stub().resolves(testData[0]);

        repoStub = {
            findAll: findAll,
            findById: findById
        }

        todo = proxy('../controllers/todo', { 'lokijs': lokiStub, '../repositories/todoRepository': repoStub });
    })

    describe('findAll', ()=> {
        describe('when successful', ()=> {
            it('should return all items', ()=> {

                todo.findAll(request, response)
                    .then(()=> {
                        var actual = response._getData();
                        expect(actual).to.deep.equal(testData);
                    });
            });

            it('should return a 200 ok', ()=> {

                todo.findAll(request, response)
                    .then(()=> {
                        expect(response.statusCode).to.equal(200);
                    });
            });
        });
        describe('when database fails', ()=> {
            it('calls next', ()=> {
                var expectedError = new Error('Failed to connect to database');
                repoStub.findAll.rejects(expectedError);

                var next = sinon.spy();
                todo.findAll(request, response, next)
                    .then(()=> {
                        expect(next.calledOnce).to.be.true;
                        expect(next.calledWith(expectedError)).to.be.true;
                    });
            })
        });
    });

    describe('findById', ()=> {

        describe('when item is found', ()=> {

            beforeEach(()=> {
                request._setParameter('id', 1);
            });

            it('should return 200 ok', ()=> {
                todo.findById(request, response)
                    .then(()=> {
                        expect(response.statusCode).to.equal(200);
                    });
            });

            it('should only return the expected item', ()=> {
                todo.findById(request, response)
                    .then(()=> {
                        var actual = response._getData();
                        expect(actual).to.deep.equal(testData[0]);
                    });
            });
        });

        describe('when item is not found', ()=> {
            beforeEach(() => {
                request._setParameter('id', 0);
            });

            it('should return 404 not found',  ()=> {
                todo.findById(request, response)
                    .then(() => {
                        expect(response.statusCode).to.equal(404);
                    });
            });
        });

        describe('when database fails', ()=> {
            it('should call next', ()=> {

                var expectedError = new Error('Failed to connect to database');
                repoStub.findById.rejects(expectedError);

                var next = sinon.spy();
                todo.findById(request, response, next)
                    .then(() => {
                        expect(next.calledOnce).to.be.true;
                        expect(next.calledWith(expectedError)).to.be.true;
                    });
            });
        });
    });

    describe('insert', ()=> {
        describe('when successful', ()=> {

            var insertSpy;
            var body = { name: 'spy on the insert' };

            beforeEach(()=> {

                request = httpMocks.createRequest({ body: body });
                insertSpy = sinon.stub(collectionStub, 'insert', ()=> {
                    return body;
                });
            });

            it('inserts to the database', ()=> {

                todo.insert(request, response);

                expect(insertSpy.calledWithExactly(body)).to.be.true;
                expect(insertSpy.calledOnce).to.be.true;
            });

            it('saves to the database', ()=> {
                todo.insert(request, response);
                expect(saveSpy.calledOnce).to.be.true;
            });

            it('returns the new todo item in the response body', ()=> {
                todo.insert(request, response);
                expect(response._getData()).to.deep.equal({ name: 'spy on the insert' });
            });

            it('returns 201 created', ()=> {
                todo.insert(request, response);
                expect(response.statusCode).to.equal(201);
            });

            it('includes a uri pointing to the new resource');
        });

        describe('when failed', ()=> {
            it('calls next', ()=> {
                var expectedError = new Error('Failed to save to database.');
                saveSpy.throws(expectedError);

                var next = sinon.spy();
                todo.insert(request, response, next);

                expect(next.calledOnce).to.be.true;
                expect(next.calledWith(expectedError)).to.be.true;
            });
        });
    });

    describe('update', ()=> {
        describe('when item is found', ()=> {

            var updateSpy = sinon.spy();
            var postData = { title: 'Foo', done: 'true' };

            beforeEach(()=> {

                request = httpMocks.createRequest({ body: postData });
                request._setParameter('id', 1);
                response = httpMocks.createResponse({ req: request });

                updateSpy = sinon.spy(collectionStub, 'update');
            });

            describe('when successful', ()=> {
                it('calls update', ()=> {
                    todo.update(request, response);
                    expect(updateSpy.calledOnce).to.be.true;
                });

                it('saves to the database', ()=> {
                    todo.update(request, response);
                    expect(saveSpy.calledOnce).to.be.true;
                });

                it('includes updated todo item in response body', ()=> {
                    todo.update(request, response);
                    expect(response._getData()).to.deep.equal(postData);
                });

                it('returns 200 ok', ()=> {
                    todo.update(request, response);
                    expect(response.statusCode).to.equal(200);
                });
            });

            describe('when failure', ()=> {
                it('calls next', ()=> {
                    var expectedError = new Error('Failed to save to database.');
                    saveSpy.throws(expectedError);

                    var next = sinon.spy();
                    todo.update(request, response, next);

                    expect(next.calledOnce).to.be.true;
                    expect(next.calledWith(expectedError)).to.be.true;
                });
            });
        });

        describe('when item is not found', ()=> {
            beforeEach(()=> {
                request._setParameter('id', 0);
            });

            it('should return 404 not found', ()=> {
                todo.update(request, response);
                expect(response.statusCode).to.equal(404);
            });
        });
    });
});
