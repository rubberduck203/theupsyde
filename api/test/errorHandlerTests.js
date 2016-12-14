var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http');

var errHandler = require('../middleware/errorHandler');

describe('errorHandler', function () {
    describe('when json requested', function () {
        var request, response;
        beforeEach(function () {
            request = httpMocks.createRequest({
                headers: {
                    Accept: 'application/json'
                }
            });
            responseOptions = { req: request };
            response = httpMocks.createResponse(responseOptions);
        });

        it('returns status 500 internal error', function () {
            var error = new Error('Fake Error');
            errHandler.handle(error, request, response, () => { });
            expect(response.statusCode).to.equal(500);
        });

        it('should log');
    });

    describe('when html requested', function () {
        var request, response;
        beforeEach(function () {
            request = httpMocks.createRequest({
                headers: {
                    Accept: 'text/html'
                }
            });
            responseOptions = { req: request };
            response = httpMocks.createResponse(responseOptions);
        });

        it('should get the error view', function () {
            const error = new Error('Fake Error');
            errHandler.handle(error, request, response, () => { });
            expect(response._getRenderView()).to.equal('error');
        });

        it('should log');
    });
});