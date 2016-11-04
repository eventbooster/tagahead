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

/**
* A very primitive function which renders a template – just pass in a template and 
* some data – and you're done. Uses extract-data to get data properties.
* Template is like: '<li>[[city.0.zip]]<br/>[[city.0.name]]</li>'
* 
*/
function renderTemplate(template, data, openingTag = '[[', closingTag = ']]') {

	// Template must have the same amount of opening and closing tags
	if (template.split(openingTag).length !== template.split(closingTag).length) throw new Error('RenderTemplate: Template must have the same amount of opening and closing tags');
	
	const rendered = [];
	template.split(openingTag).forEach((tag, index) => {

		// First and last split do not never contain a tag
		if (!index) {
			rendered.push(tag);
			return;
		}

		// Get content of tag
		const split = tag.split(closingTag);

		// Tag not closed
		if (split.length !== 2) throw new Error('RenderTemplate: Tag is not closed before new tag begins');

		// Get value, put things together
		const value = extractData(data, split[0].trim());
		rendered.push(value === undefined ? '' : value); // Don't ever push undefined; will be converted to «undefined»
		rendered.push(split[1]);

	});

	return rendered.join('');

}

/* globals describe, it */

const assert = require('assert');

describe('Render Template', () => {

	describe('Errors', () => {

		it('throws if opening and closing tags don\'t match', () => {
			assert.throws(() => {renderTemplate('[[test]][[');}, /opening and closing/);
		});

		it('throws if tags are not nested correctly', () => {
			assert.throws(() => {renderTemplate('[[test[[test]]]]');}, /before/);
		});

	});

	describe('Rendering', () => {

		it('renders template with default tags correctly', () => {
			const rendered = renderTemplate('<li>[[city.0.name]]<br/>[[city.0.zip]]</li>', {city:[{name:'Winti',zip:8400}]});
			assert.equal(rendered, '<li>Winti<br/>8400</li>');
		});

		it('renders template with custom tags correctly', () => {
			const rendered = renderTemplate('<li>((city.0.name))<br/>((city.0.zip))</li>', {city:[{name:'Winti',zip:8400}]}, '((', '))');
			assert.equal(rendered, '<li>Winti<br/>8400</li>');
		});

		it('replaces undefined values with empty strings', () => {
			assert.equal(renderTemplate('<li>[[test.0.test]]</li>', {}), '<li></li>');
		});

	});

});
