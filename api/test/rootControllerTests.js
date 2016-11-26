var mocha = require('mocha'),
    expect = require('chai').expect,
    httpMocks = require('node-mocks-http');

var root = require('../routes/root');

describe('RootController', function () {
    
    var req, res;
    beforeEach(function(){
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
    });

    describe('index', function(){
        it('returns a 200 ok', function(){
            root.index(req, res);
            expect(res.statusCode).to.equal(200);
        });

        describe('when json reqested', function(){
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