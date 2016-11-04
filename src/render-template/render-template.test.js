/* globals describe, it */

import renderTemplate from './render-template.js';

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