<p align="left">
<a href="https://travis-ci.org/Tabaci/reflect-args"><img src="https://travis-ci.org/Tabaci/reflect-args.svg?branch=master"></a>
<a href="https://codecov.io/gh/Tabaci/http-cookie"><img src="https://codecov.io/gh/Tabaci/http-cookie/branch/master/graph/badge.svg" /></a>
</p>

# reflect-args

This *npm* module defines a means of retrieving parameters from a function from 
outside the function. It works with any function or closure, including methods, 
but not with constructors wrapped inside ES6 classes. 

## Installation

```javascript
$ npm install reflect-args
```

### Usage

Before using it, we need to define it:

```javascript
const getArgs = require('reflect-args').getArgs
```

The `getArgs` function takes in a `function` and returns a `Map` containing all 
the parameters of that `function`.

### Function or Closure

```javascript
let func = function (foo, bar = 12, test = '12', cb = () => {}) {
	// TODO: body stub
}

console.log(getArgs(func))

/* Expected output:
 * Map {
 *     'foo' => undefined, 
 *     'bar' => 12, 
 *     'test' => '12',
 *     'cb' => [Function: cb]
 * }
 */
```

### Method (Can Be Static)

```javascript
let Class = class Test
{
	constructor () {}
	
	func (foo, bar) {
		
	}
}
let inst = new Class()

console.log(getArgs(inst.func))

/* Expected output:
 * Map {
 *     'foo' => undefined, 
 *     'bar' => undefined	
 * }
 */
```

### Pattern Matched Parameters

Sometimes you may want to let the end user (programmer) use pattern matching 
inside their function whose arguments are reflected. During such cases, the 
`getArgs` function will give the keys the names of an incrementing range:

```javascript
let patternMatched = function ({foo, bar}, test, [more, and])
{
	
}

console.log(getArgs(patternMatched))

/* Expected output:
 * Map {
 *     '__0' => '{foo, bar}', 
 *     'test' => undefined, 
 *     '__1' => '[more, and]'
 * }
 */
```

## Discussion

The way this works is by utilizing the `Function.prototype.toString` function, 
by extracing the arguments from that string. This means that if the code is 
obfuscated, this will not work.

That same sentence holds true for reflection done in any other language. If the 
code is obfuscated, the reflected variable names will be changed into whatsoever 
they were obfuscated into.

As for most cases, there is no point in minifying (thus obfuscating) server-side 
code, as we do not actually have to send the data to some client, thus saving on 
band-width. If, for some reason, you would like to minify server-sided code 
using this module, make sure the minifier does not obfuscate away variable 
names.
