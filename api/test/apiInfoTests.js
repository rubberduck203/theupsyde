var mocha = require('mocha'),
    expect = require('chai').expect;

var ApiInfo = require('../ApiInfo');

describe('ApiInfo', function(){

    describe('title', function(){
        it('should have a Title', function(){
            var apiInfo = new ApiInfo();
            expect(apiInfo).to.have.property('Title');
        });

        it('should have a Title of "Todo API"', function(){
            var apiInfo = new ApiInfo();
            expect(apiInfo.Title).to.equal('Todo API');
        });
    });

    describe('_links', function(){
        it('should have a collection of links', function(){
            var apiInfo = new ApiInfo();
            expect(apiInfo._links).to.be.a('Array');
        });

        it('should have a self reference pointing to root', function(){
            var apiInfo = new ApiInfo();
            expect(apiInfo._links[0].self.href).to.equal('/');
        });
    });
});