var mocha = require('mocha'),
    proxy = require('proxyquire'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    expect = require('chai').use(sinonChai).expect,
    sinonAsPromised = require('sinon-as-promised');



var todo = require('../repositories/todoRepository');

describe('TodoRepository', () => {

    const testData = [
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

    var collectionStub = {
        data: testData,
        findOne: (query) => {
            for (var i = 0; i < testData.length; i++) {
                if (query.$loki === testData[i].$loki) {
                    return testData[i];
                }
            }
        },
        insert: () => { },
        update: () => { }
    }

    var saveSpy = sinon.spy(),
        getCollectionStub = sinon.stub().returns(collectionStub);

    var postData;

    beforeEach(() => {
        postData = { title: 'foo', done: true };

        saveSpy = sinon.spy();
        var lokiStub = function loki(filename) {
            this.loadDatabase = function (options, callback) {
                callback();
            };

            this.getCollection = getCollectionStub;
            this.save = saveSpy;
        };

        todo = proxy('../repositories/todoRepository', { 'lokijs': lokiStub });
    });

    describe('update', () => {
        var updateSpy = sinon.spy();

        before(() => {
            updateSpy = sinon.spy(collectionStub, 'update');
        })

        it('calls update', () => {
            return todo.update(1, postData)
                .then(() => {
                    expect(updateSpy).to.have.been.calledOnce;
                }).catch((err) => {
                    throw err;
                });
        });

        it('saves to the database', () => {

            return todo.update(1, postData)
                .then(() => {
                    expect(saveSpy).to.have.been.calledOnce;
                }).catch((err) => {
                    throw err;
                });
        });
    });

    describe('insert', () => {
        var insertSpy = sinon.stub();

        before(() => {
            insertSpy = sinon.stub(collectionStub, 'insert', () => {
                return postData;
            });
        })

        it('inserts the item', () => {
            return todo.insert(postData)
                .then(() => {
                    expect(insertSpy).to.have.been.calledOnce;
                    expect(insertSpy).to.have.been.calledWith(postData);
                }).catch((err) => {
                    throw err;
                });
        });

        it('saves to the database', () => {
            return todo.insert(postData)
                .then(() => {
                    expect(saveSpy).to.have.been.calledOnce;
                }).catch((err) => {
                    throw err;
                });
        });

        it('returns the new document', () => {
            return todo.insert(postData)
                .then((result) => {
                    expect(result).to.deep.equal(postData);
                }).catch((err) => {
                    throw err;
                })
        });
    });
});