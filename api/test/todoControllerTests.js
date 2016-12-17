var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http'),
    proxy = require('proxyquire'),
    sinon = require('sinon'),
    sinonAsPromised = require('sinon-as-promised');

var todo = require('../controllers/todo');

describe('TodoController', () => {

    var repoStub;
    var request, response, testData;
    beforeEach(() => {

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

        var findAll = sinon.stub().resolves(testData);
        var findById = sinon.stub().resolves(testData[0]);
        var update = sinon.stub();
        var insert = sinon.stub();

        repoStub = {
            findAll: findAll,
            findById: findById,
            update: update,
            insert: insert
        }

        todo = proxy('../controllers/todo', { '../repositories/todoRepository': repoStub });
    })

    describe('findAll', () => {
        describe('when successful', () => {
            it('should return all items', () => {
                return todo.findAll(request, response)
                    .then(() => {
                        var actual = response._getData();
                        expect(actual).to.deep.equal(testData);
                    }).catch((err) => {
                        throw err
                    });
            });

            it('should return a 200 ok', () => {

                return todo.findAll(request, response)
                    .then(() => {
                        expect(response.statusCode).to.equal(200);
                    }).catch((err) => {
                        throw err;
                    });
            });
        });
        describe('when database fails', () => {
            it('calls next', () => {
                var expectedError = new Error('Failed to connect to database');
                repoStub.findAll.rejects(expectedError);

                var next = sinon.spy();
                return todo.findAll(request, response, next)
                    .then(() => {
                        expect(next.calledOnce).to.be.true;
                        expect(next.calledWith(expectedError)).to.be.true;
                    }).catch((err) => {
                        throw err;
                    });
            })
        });
    });

    describe('findById', () => {

        describe('when item is found', () => {

            beforeEach(() => {
                request._setParameter('id', 1);
            });

            it('should return 200 ok', () => {
                return todo.findById(request, response)
                    .then(() => {
                        expect(response.statusCode).to.equal(200);
                    }).catch((err) => {
                        throw err;
                    });
            });

            it('should only return the expected item', () => {
                return todo.findById(request, response)
                    .then(() => {
                        var actual = response._getData();
                        expect(actual).to.deep.equal(testData[0]);
                    }).catch((err) => {
                        throw err;
                    });
            });
        });

        describe('when item is not found', () => {
            beforeEach(() => {
                request._setParameter('id', 0);
            });

            it('should return 404 not found', () => {
                repoStub.findById.resolves(null);

                return todo.findById(request, response)
                    .then(() => {
                        expect(response.statusCode).to.equal(404);
                    }).catch((err) => {
                        throw err;
                    });
            });
        });

        describe('when database fails', () => {
            it('should call next', () => {

                var expectedError = new Error('Failed to connect to database');
                repoStub.findById.rejects(expectedError);

                var next = sinon.spy();
                return todo.findById(request, response, next)
                    .then(() => {
                        expect(next.calledOnce).to.be.true;
                        expect(next.calledWith(expectedError)).to.be.true;
                    }).catch((err) => {
                        throw err;
                    });
            });
        });
    });

    describe('insert', () => {
        describe('when successful', () => {

            var body = { name: 'spy on the insert' };

            beforeEach(() => {
                request = httpMocks.createRequest({ body: body });
                repoStub.insert.resolves(body);
            });

            it('inserts to the database', () => {
                return todo.insert(request, response)
                    .then(() => {
                        expect(repoStub.insert).to.have.been.calledOnce;
                        expect(repoStub.insert).to.have.been.calledWith(body);
                    }).catch((err) => {
                        throw err;
                    });
            });

            it('returns the new todo item in the response body', () => {

                return todo.insert(request, response)
                    .then(() => {
                        expect(response._getData()).to.deep.equal(body);
                    }).catch((err) => {
                        throw err;
                    });
            });

            it('returns 201 created', () => {
                return todo.insert(request, response)
                    .then(() => {
                        expect(response.statusCode).to.equal(201);
                    }).catch((err) => {
                        throw err;
                    });
            });

            it('includes a uri pointing to the new resource');
        });

        describe('when failed', () => {
            it('calls next', () => {
                var expectedError = new Error('Failed to save to database.');
                repoStub.insert.rejects(expectedError);

                var next = sinon.spy();
                return todo.insert(request, response, next)
                    .then(() => {
                        expect(next.calledOnce).to.be.true;
                        expect(next.calledWith(expectedError)).to.be.true;

                    }).catch((err) => {
                        throw err;
                    });
            });
        });
    });

    describe('update', () => {
        describe('when item is found', () => {

            var postData = { title: 'Foo', done: 'true' };

            beforeEach(() => {

                request = httpMocks.createRequest({ body: postData });
                response = httpMocks.createResponse({ req: request });

                repoStub.update.resolves(postData);
            });

            describe('when successful', () => {

                it('includes updated todo item in response body', () => {
                    return todo.update(request, response)
                        .then(() => {
                            expect(response._getData()).to.deep.equal(postData);
                        }).catch((err) => {
                            throw err;
                        });
                });

                it('returns 200 ok', () => {
                    return todo.update(request, response)
                        .then(() => {
                            expect(response.statusCode).to.equal(200);
                        }).catch((err) => {
                            throw err;
                        });
                });
            });

            describe('when failure', () => {
                it('calls next', () => {
                    var expectedError = new Error('Failed to save to database.');
                    repoStub.update.rejects(expectedError);

                    var next = sinon.spy();
                    return todo.update(request, response, next)
                        .then(() => {
                            expect(next.calledOnce).to.be.true;
                            expect(next.calledWith(expectedError)).to.be.true;
                        }).catch((err) => {
                            throw err;
                        });
                });
            });
        });

        describe('when item is not found', () => {
            beforeEach(() => {
                request._setParameter('id', 0);
                repoStub.update.resolves(null);
            });

            it('should return 404 not found', () => {

                return todo.update(request, response, () => { })
                    .then(() => {
                        expect(response.statusCode).to.equal(404);
                    }).catch((err) => {
                        throw err;
                    });
            });
        });
    });
});
