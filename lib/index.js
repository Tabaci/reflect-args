
/**
 * @author Alexander Hållenius
 * 
 * Retrieve the arguments from a given function, including the arguments' 
 * default values if specified.
 * 
 * @param {function} func
 * 
 * @return {Object.<string,>} An object containing the keys as the names of the 
 *         parameters, and default values as the values.
 */
function getArgs (func)
{
	let paramString = extractArgs(func)
	let pieces = {}
	
	let Mode = Object.freeze({
		variable: 0, 
		value: 1
	})
	
	// Manually locate all splits
	let mode = Mode.variable
	
	let capture = '' // The capture string
	let varName
	let insideString // Same as '#extractArgs (function)'
	let curly = 0
	let parenth = 0
	let escaped = false
	
	for (let i = 0; i < paramString.length; i ++)
	{
		let c = paramString[i]
		
		switch(mode)
		{
			case Mode.value:
				if (insideString !== undefined)
				{
					if (c === '\\')
						escaped = true
					else if (escaped)
						escaped = false
					else if (c === insideString)
						insideString = undefined
					
					capture += c
				}
				else if (c === '"' || c === "'")
					(insideString = c, 
						capture += c)
				else if (c === '{')
					(curly ++, 
						capture += c)
				else if (c === '}')
					(curly --, 
						capture += c)
				else if (c === '(')
					(parenth ++, 
						capture += c)
				else if (c === ')')
					(parenth --, 
						capture += c)
				else if (c === ',' && parenth === 0 && curly === 0)
				{
					pieces[varName] = eval(capture.trim())
					capture = ''
					mode = Mode.variable
				}
				else
					capture += c
				
				break
			
			case Mode.variable:
				if (c === '=')
				{
					mode = Mode.value
					capture = capture.trim()
					varName = capture
					capture = ''
					
					// TODO: set variable name and push to 'pieces'
				}
				else if (c === ',')
				{
					capture = capture.trim()
					pieces[capture] = undefined
					capture = ''
					
					// TODO: push to pieces with 'undefined'
				}
				else
					capture += c
				
				break
		}
	}
	
	// Fill in the final segment
	switch(mode)
	{
		case Mode.variable:
			capture = capture.trim()
			pieces[capture] = undefined
			
			break
		
		case Mode.value:
			pieces[varName] = eval(capture.trim())
			
			break
	}
	
	return pieces
}

/**
 * @author Alexander Hållenius
 * 
 * Extracts the arguments from a given function.
 * 
 * @param {function} func
 * 
 * @return {string} String containing the parameters of the function sent in.
 */
function extractArgs (func)
{
	let funcString = resolveFunc(func)
	
	let paramWithBodyString = funcString.replace(/^[^]*?\(/g, '')
	let paramString
	
	// Extract only the parameters
	let insideString // "'" or '"' the type of string inside, or undefined
	let parenth = 0 // Level inside parenthesis
	let escaped = false // Inside string, escaped!
	
	for (let i = 0; i < paramWithBodyString.length; i ++)
	{
		let c = paramWithBodyString[i]
		
		if (insideString !== undefined)
		{
			if (c === '\\')
				escaped = true
			else if (escaped)
				escaped = false
			else if (c === insideString)
				insideString = undefined
		}
		else if (c === "'" || c == '"')
			insideString = c
		else if (c === '(')
			parenth ++
		else if (c === ')' && parenth > 0)
			parenth --
		else if (c === ')')
		{
			paramString = paramWithBodyString.substring(0, i)
			
			break
		}
	}
	
	return paramString
}

/**
 * @author Alexander Hållenius
 * 
 * Resolves a function to a string. If the string is a class, the constructor's 
 * string (if applicable) will be used instead.
 * 
 * @param {function} func
 * 
 * @return {string}
 * 
 * TODO: args property for arguments sent to new instances with Object.create?
 */
function resolveFunc (func)
{
	let funcString = func.toString()
	
	// TODO: attempt to support class constructors
	
	return funcString
}

module.exports.resolveFunc = resolveFunc
module.exports.extractArgs = extractArgs
module.exports.getArgs = getArgs
