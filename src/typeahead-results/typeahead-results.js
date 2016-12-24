import renderTemplate from '../render-template/render-template.js';


(() => {

	/* global window, HTMLElement, document, CustomEvent */

	/**
	* Displays a list with entries which may be set through setData. If an entry is selected,
	* an 'item-selected' event will be fired.
	*/
	class TypeaheadResults extends HTMLElement {





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

			this._resultTemplate 						= this._getTemplateContentAsHTML(resultTemplate);
			this._noResultsTemplate 					= this._getTemplateContentAsHTML(noResultsTemplate);
			if(errorTemplate) this._errorTemplate 		= this._getTemplateContentAsHTML(errorTemplate);

			// Empty element
			this._emptyElement();

			this._addSelectItemEventListener();

		}



		/**
		* <selectable-list-item> fires select-item event. Catch it here, stop propagation and add data and
		* text properties. Why here? Because data is also set in this class, and selectable-list-item is not
		* aware of it.
		*/
		_addSelectItemEventListener() {
			this.addEventListener('select-item', (ev) => {

				// If it's the select-item event dispatched by this element (<typeahead-results>), 
				// just return or we'll have an infinite loop.
				if (ev.target === this) return;

				ev.stopPropagation();
				ev.preventDefault();

				const eventData = {
					bubbles			: true
					, detail		: {
						data			: ev.target.data
						, text			: ev.target.textContent
					}
				};

				this.dispatchEvent(new CustomEvent('select-item', eventData));

			});
		}


		/**
		* Public method to store input that needs to be added to <selectable-list> (to control ith through
		* keyboard input)
		*/
		setInput(inputElement) {
			this._inputElement = inputElement;
			//console.error(inputElement);
		}

		/**
		* Returns element set through this.setInput
		*/
		getInput() {
			return this._inputElement;
		}




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

			// Error
			if (data instanceof Error) {
				this.innerHTML = this._renderError(data);
			}

			// Array with values
			else if (Array.isArray(data) && data.length) {
				this.innerHTML = '';
				this.appendChild(this._renderData(data));
			}

			// Empty array
			else if (Array.isArray(data) && !data.length) {
				this.innerHTML = this._renderEmptyData();
			}

			// Invalid argument
			else {
				throw new Error(`TypeaheadResult: Data is not an array nor an error, cannot be handled.`);
			}

		}


		/**
		* Returns classes that will be added to rendered <ul>
		* @return {String}
		*/
		_getListClass(empty, error) {
			return `typeahead-results-list ${ empty ? 'empty' : '' } ${ error? 'error' : '' }`.trim().replace(/\s+/g, ' ');
		}

		/**
		* Returns classes that will be added to rendered <li>s
		* @return {String}
		*/
		_getListElementClass(empty, error) {
			return `typeahead-results-list-item ${ empty ? 'empty' : '' } ${ error? 'error' : '' }`.trim().replace(/\s+/g, ' ');
		}


		/**
		* Empties current element
		*/
		_emptyElement() {
			while(this.childNodes.length) this.removeChild(this.childNodes[0]);
		}





		/**
		* Renders data for a result list. 
		* @returns HTMLElement (<selectable-list>)
		*/
		_renderData(data) {

			const renderedItems = [];

			// Create list items
			data.forEach((item) => {

				// Content of list element
				const renderedInnerContent = renderTemplate(this._resultTemplate, item)
				// List element
					, renderedOuterContent = document.createElement('selectable-list-item');

				// Add class and content to list element
				renderedOuterContent.classList.add(this._getListElementClass());
				renderedOuterContent.innerHTML = renderedInnerContent;
				// Store data as property on the element
				renderedOuterContent.data = item;

				// Push list element to renderedItems
				renderedItems.push(renderedOuterContent);
			});

			console.log('TypeaheadResult: Results are %o', renderedItems.map(item => item.outerHTML));

			// Create list, add list items
			const list = document.createElement('selectable-list');
			list.classList.add(this._getListClass());
			// Add input to list (for keyboard navigation)
			if (this._inputElement) list.addInput(this._inputElement);

			// Add list items to list
			renderedItems.forEach((item) => {
				list.appendChild(item);
			});

			return list;

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
				</ul>
				`.replace(/(\t|\n)*/g, '');
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
				</ul>
				`.replace(/(\t|\n)*/g, '');
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