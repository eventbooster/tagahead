const assert = require('assert');

/* global describe, it */

import extractData from './extract-data.js';

describe('Arrays', () => {

	describe('Errors', () => {

		it('throws if path is not a number', () => {
			assert.throws(() => {extractData([], 'test');}, /of a number/);
		});

		it('throws if path is < 0', () => {
			assert.throws(() => {extractData([], '-4');}, /greater/);
		});

	});


	describe('Values', () => {

		it('returns undefined if value is not available', () => {
			assert.equal(extractData([1],'2'), undefined);
		});

		it('returns the value if it is available', () => {
			assert.equal(extractData([1,2,3],'2'), 3);
		});

	});


});


describe('Objects', () => {

	describe('Values', () => {

		it('returns undefined if no value is found', () => {
			assert.equal(extractData({}, 'test'), undefined);
		});

		it('returns undefined for invalid paths', () => {
			assert.equal(extractData({}, 'test.test.test.0.test'), undefined);
		});

		it('returns the value', () => {
			assert.equal(extractData({test:4}, 'test'), 4);
		});

	});

});



describe('Nested', () => {

	it('returns correct values', () => {

		assert.equal(extractData({test:[1,2,3]},'test.2'), 3);
		assert.equal(extractData({test:[1,2,{do:'that'}]},'test.2.do'), 'that');

	});

});