
const expect = require('chai').expect
const getArgs = require('./../lib/index.js').getArgs
const extractArgs = require('./../lib/index.js').extractArgs
const resolveFunc = require('./../lib/index.js').resolveFunc

function map (...vals)
{
	let arr = []
	
	for (let i = 0; i < vals.length; i += 2)
		arr.push([vals[i], vals[i + 1]])
	
	return new Map(arr)
}

describe('Getting arguments from outside functions', function () {
	describe('#getArgs (function)', function () {
		it('should list all parameters of a function when given a function', function () {
			let func = function (foo, bar) {}
			expect(getArgs(func)).to.deep.equal(map('foo', undefined, 'bar', undefined))
			
			let clos = (foo) => {}
			expect(getArgs(clos)).to.deep.equal(map('foo', undefined))
		})
		
		it('should allow for default parameters to be escaped', function () {
			let func = function(foo = '\ntest') {}
			expect(getArgs(func)).to.deep.equal(map('foo', '\ntest'))
		})
		
		it('should list all parameters of the constructor when given a constructor function', function () {
			let constFunc = function (test) {}
			expect(getArgs(constFunc)).to.deep.equal(map('test', undefined))
			
			let clas = class Test {
				constructor (test) {}
				test (test) {}
			}
			let method = (new clas('')).test
			expect(getArgs(clas)).to.deep.equal(map('test', undefined))
		})
		
		it('should list all parameters of a function with default parameters', function () {
			let func = function (test = '12', bar = 2) {}
			expect(getArgs(func)).to.deep.equal(map('test', '12', 'bar', 2))
			
			let func2 = (test = () => { return ('hello', 'test') }, bar = () => {}) => {
				
			}
			
			expect(getArgs(func2).get('test')()).to.equal('test')
		})
		
		it('should work with a static method', function () {
			let clas = class Test
			{
				static method (foo, bar) {
					
				}
			}
			let method = clas.method
			
			expect(getArgs(method)).to.deep.equal(map(
				'foo', undefined, 
				'bar', undefined
			))
		})
		
		it('should work with doc comments', function () {
			/**
			 * I am a documentation comment. Why on Earth I would appear with 
			 * the function itself, I have( no clue. )
			 */
			function test (foo, bar)
			{
				
			}
			
			expect(getArgs(test)).to.deep.equal(map(
				'foo', undefined, 
				'bar', undefined
			))
		})
		
		it('should insert a dummy key for pattern matched segments', function () {
			function test ({foo, bar}, hello) {}
			
			expect(getArgs(test)).to.deep.equal(map(
					'__0', '{foo, bar}', 
					'hello', undefined))
			
			function test2 ([foo, bar], hello) {}
			
			expect(getArgs(test2)).to.deep.equal(map(
					'__0', '[foo, bar]', 
					'hello', undefined))
		})
		
		it('should support multiple pattern matched segments', function () {
			function test ({hey, ho}, [foo, bar], hi) {}
			
			expect(getArgs(test)).to.deep.equal(map(
					'__0', '{hey, ho}', 
					'__1', '[foo, bar]', 
					'hi', undefined))
		})
	})
	
	describe('#extractArgs (function)', function () {
		it('should return the parameters a given function in the form of a string', function () {
			let func = function (foo, bar) {}
			expect(extractArgs(func)).to.equal('foo, bar')
			
			let clos = (foo, bar) => {}
			expect(extractArgs(func)).to.equal('foo, bar')
		})
		
		it('should return the parameters of a given method in the form of a string', function () {
			let method = (new (class {
				test (foo, bar)
				{
					
				}
			})).test
			
			expect(extractArgs(method)).to.equal('foo, bar')
		})
		
		it('should return a string of all parameters given a constructor function', function () {
			let constFunc = function(test) {}
			expect(extractArgs(constFunc)).to.equal('test')
			
			let clas = class Test {
				constructor (test, twelve) {}
			}
			
			expect(extractArgs(clas)).to.equal('test, twelve')
		})
		
		it('should return the parameters of a given function with default parameters in the form of a string', function () {
			let func = function (foo = 2, bar = '12') {}
			expect(extractArgs(func)).to.equal('foo = 2, bar = \'12\'')
			
			let func2 = function (foo = "12", bar = '12') {}
			expect(extractArgs(func2)).to.equal('foo = "12", bar = \'12\'')
			
			let crazyFunc = function (foo = 2, bar = () => {}) {}
			expect(extractArgs(crazyFunc)).to.equal('foo = 2, bar = () => {}')
		})
	})
	
	describe('#resolveFunc (function)', function () {
		it('should format the function in the form of a string when called', function () {
			let func = function(test) {}
			expect(resolveFunc(func)).to.equal('function (test) {}')
			
			let clas = class Test
			{
				constructor (test) {}
				
				test (test, test2) {}
			}
			expect(resolveFunc(clas.prototype.test)).to.equal('test(test, test2) {}')
		})
	})
})
