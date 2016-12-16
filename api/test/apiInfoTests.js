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

        it('should have a list of all the Todo endpoints', function(){
            var apiInfo = new ApiInfo();
            expect(apiInfo._links[1].todo).to.be.a('Array');
        });

        it('should have an index', function(){
            var apiInfo = new ApiInfo();
            var todoLinks = apiInfo._links[1].todo;
            expect(todoLinks[0].href).to.equal('/todo');
        });

        it('should have a templated id lookup', function(){
            var apiInfo = new ApiInfo();
            var todoLinks = apiInfo._links[1].todo;
            expect(todoLinks[1].href).to.equal('/todo/{id}');
            expect(todoLinks[1].templated).to.be.true;
        });
    });
});