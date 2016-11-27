var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http');

var ApiInfo = require('../ApiInfo');
var root = require('../routes/root');

describe('RootController', function () {
    
    describe('index', function(){
         describe('when json reqested', function(){
            var req, res;
            beforeEach(function(){
                req = httpMocks.createRequest({
                    headers: {
                        Accept: 'application/json'
                    }
                });
                var responseOptions = {req: req};
                res = httpMocks.createResponse(responseOptions);
            });

            it('returns a 200 ok', function(){
                root.index(req, res);
                expect(res.statusCode).to.equal(200);
            });

            it('should return ApiInfo', function(){
                var expected = new ApiInfo();

                root.index(req, res);
                var actual = res._getData();
                
                expect(actual).to.deep.equal(expected);
            });
        });

        describe('when html is requested', function(){
            var request, response;
            beforeEach(function(){
                request = httpMocks.createRequest({
                    headers: {
                        Accept: 'text/html'
                    }
                });
                responseOptions = {req: request};
                response = httpMocks.createResponse(responseOptions);
            });

            it('should get the root view', function(){
                root.index(request, response);
                expect(response._getRenderView()).to.equal('root');
            });

            it('should return ApiInfo', function(){
                root.index(request, response);
                expect(response._getRenderData()).to.deep.equal(new ApiInfo());
            });
        });
    });
});