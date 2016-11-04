import renderTemplate from '../render-template/render-template.js';


(() => {

	/* global window, HTMLElement, document */

	/**
	* Displays a list with entries which may be set through setData. If an entry is selected,
	* an 'item-selected' event will be fired.
	*/
	class TypeaheadResults extends HTMLElement {


		/**
		* The element's only public method: Accepts data and renders it.
		* @param {Array|Error} data		Array with results (objects) or an empty array.
		*								Error if retrieving data led to an error.
		*/
		setData(data) {
			
			console.log('TypeaheadResults: data updated to %o', data);
			this._data = data;
			this._renderTemplates(data);

		}



		/**
		* Handles any data update and calls corresponding rendering function or throws an
		* error if data is not valid.
		*
		* Modifies innerHTML of element
		* @param {Array|Error data} data	See this.setData
		*/
		_renderTemplates(data) {

			let inner;

			// Error
			if (data instanceof Error) inner = this._renderError(data);
			// Array with values
			else if (Array.isArray(data) && data.length) inner = this._renderData(data);
			// Empty array
			else if (Array.isArray(data) && !data.length) inner = this._renderEmptyData();
			// Invalid argument
			else throw new Error(`TypeaheadResult: Data is not an array nor an error, cannot be handled.`);

			this.innerHTML = inner;

		}


		/**
		* Returns classes that will be added to rendered <ul>
		* @return {String}
		*/
		_getListClass(empty, error) {
			return `typeahead-results-list ${ empty ? '-empty' : '' } ${ error? '-error' : '' }`.trim().replace(/\s+/g, ' ');
		}

		/**
		* Returns classes that will be added to rendered <li>s
		* @return {String}
		*/
		_getListElementClass(empty, error) {
			return `typeahead-results-list-item ${ empty ? '-empty' : '' } ${ error? '-error' : '' }`.trim().replace(/\s+/g, ' ');
		}


		/**
		* Empties current element
		*/
		_emptyElement() {
			while(this.childNodes.length) this.removeChild(this.childNodes[0]);
		}


		/**
		* Returns a rendered an array of data. 
		* @returns {String}
		*/
		_renderData(data) {

			const renderedItems = [];
			data.forEach((item) => {
				renderedItems.push(renderTemplate(this._resultTemplate, item));
			});
			// Wrap in li
			const wrappedRenderedItems = renderedItems.map((item) => {
				return `<li class="${ this._getListElementClass() }">${ item }</li>`;
			});
			// Remove spaces for easier testing
			return `
				<selectable-list>
					<ul class="${ this._getListClass() }">
						${ wrappedRenderedItems.join('') }
					</ul>
				</selectable-list>`.replace(/(\t|\n)*/g, '');

		}


		/**
		* Renders a rendered empty data set («No results found»). 
		* @returns {String}
		*/
		_renderEmptyData() {
			// Remove spaces for easier testing
			return `
				<ul class="${ this._getListClass(true) }">
					<li class="${ this._getListElementClass(true) }">
						${ this._noResultsTemplate }
					</li>
				</ul>`.replace(/(\t|\n)*/g, '');
		}


		/**
		* Renders a rendered error.
		* @returns {String}
		*/
		_renderError(error) {
			const content = renderTemplate(this._errorTemplate || '[[message]]', error);
			// Remove spaces for easier testing
			return `
				<ul class="${ this._getListClass(false, true) }">
					<li class="${ this._getListElementClass(false, true) }">
						${ content }
					</li>
				</ul>`.replace(/(\t|\n)*/g, '');
		}


		/**
		* Attached to DOM: Get templates, store them in properties and empty element in order
		* to be ready to render the list whenever data gets in.
		*/
		connectedCallback() {

			// When component is attached to dom, read its children and 
			// store templates as properties.
			const resultTemplate		= this.querySelector('#result-template');
			const noResultsTemplate		= this.querySelector('#empty-result-set-template');
			const errorTemplate			= this.querySelector('#error-template');

			// Templates missing
			if (!resultTemplate || !noResultsTemplate ) throw new Error(`TypeaheadResults: Templates for results or empty result set missing.`);
			if (!errorTemplate) console.warn(`TypeaheadResults: Template for errors missing.`);

			this._resultTemplate 		= this._getTemplateContentAsHTML(resultTemplate);
			this._noResultsTemplate 	= this._getTemplateContentAsHTML(noResultsTemplate);
			if(errorTemplate) this._errorTemplate = this._getTemplateContentAsHTML(errorTemplate);

			// Empty element
			this._emptyElement();

		}


		/**
		* <template> tag has a special behavior (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template), 
		* innerHTML cannot be called on it directly. Therefore, we have to create a <div>, append the template's content
		* and take the div's innerHTML
		*/
		_getTemplateContentAsHTML(template) {
			const div = document.createElement('div');
			div.appendChild(template.content);
			return div.innerHTML;
		}

	}


	window.customElements.define('typeahead-results', TypeaheadResults);
	// Make class public for JS instantiation
	window.TypeaheadResults = TypeaheadResults;


})();