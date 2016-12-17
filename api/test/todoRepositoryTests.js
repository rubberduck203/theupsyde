var mocha = require('mocha'),
    expect = require('chai').expect,
    proxy = require('proxyquire'),
    sinon = require('sinon'),
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

    beforeEach(() => {
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

        var postData;
        var updateSpy = sinon.spy();

        before(() => {
            updateSpy = sinon.spy(collectionStub, 'update');
            postData = { title: 'foo', done: true };
        })

        it('calls update', () => {
            return todo.update(1, postData)
                .then(() => {
                    expect(updateSpy.calledOnce).to.be.true;
                }).catch((err) => {
                    throw err;
                });
        });

        it('saves to the database', () => {

            return todo.update(1, postData)
                .then(() => {
                    expect(saveSpy.calledOnce).to.be.true;
                }).catch((err) => {
                    throw err;
                });
        });
    });
});