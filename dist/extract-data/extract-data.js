/**
* «XPath» for objects. Takes an object/array and a path, returns value that the object
* has at path. 
* @param {Object} data
* @param {String} path			Dot separated path that points to a value of the data
*								passed in, e.g. city.0.name (gets city's first array item
*								and returns its name property)
*/
function extractData(data, path) {

	const pathElements		= path.split('.')
		, property			= pathElements[0]
		, left 				= pathElements.slice(1).join('.');

	// Array
	if (Array.isArray(data)) {

		const index = new Number(property);

		// Property is not a number
		if(isNaN(index)) throw new Error(`ExtractData: When data is an array, property must be some kind of a number, but is ${ property }.` );
		// Property is < 0
		if(index < 0) throw new Error(`ExtractData: Index for an array must be greater than 0, is ${ property }`);

		// Path left: Call myself recursively
		if (left) return extractData(data[property], left);
		// Return final value
		else return data[property];

	} 

	// Object
	else if (typeof data === 'object' && data !== null){

		if(left) return extractData(data[property], left);
		else return data[property];

	}

	// Someting else (e.g. Number, undefined, null…)
	else {
		return;
	}

}

export default extractData;
