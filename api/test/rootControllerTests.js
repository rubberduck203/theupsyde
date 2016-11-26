var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http');

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
                var ApiInfo = require('../ApiInfo');
                var expected = new ApiInfo();

                root.index(req, res);
                var actual = res._getData();
                
                expect(actual).to.deep.equal(expected);
            });
        });
    });
});