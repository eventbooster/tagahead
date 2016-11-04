/* global HTMLElement, window, document */

(() => {
	class Typeahead extends HTMLElement {


		/**
		* Public method to set the data provider which returns the data.
		* @param {Function} provider		Data provider for the typeahead. Must take
		*									an argument which is the search term and return
		*									a Promise. The promise must resolve to an Error
		*									(if the request failed) or an array with objects
		*									which contain the data to be rendered in the suggestion
		*									list.
		*/
		set dataProvider(provider) {
			this._dataProvider = provider;
		}



		/**
		* @returns {Function} 				Returns the data Provider of this typeahead
		*									which was set through set dataProvider.
		*/
		get dataProvider() {
			return this._dataProvider;
		}




		/**
		* Called when element is added to DOM. Setup <typeahead-input> and all its listeners.
		*/
		connectedCallback() {
			// Result list
			this._resultList = document.createElement('typeahead-results');
			// Copy innerHTML to resultList
			this._resultList.innerHTML = this.innerHTML;
			this.innerHTML = '';
			this.appendChild(this._resultList);
			this._hideResults();

			// Input
			const input = document.createElement('typeahead-input');
			this._addInputEventListeners(input);
			this.appendChild(input);

		}



		/**
		* Adds listeners to the input element (<typeahead-input>)
		* @param {HTMLElement} input		The <typeahead-input> which is part of this component.
		*/
		_addInputEventListeners(input) {

			// value-change fired on typeahead-input
			input.addEventListener('value-change', (ev) => {
				const value = ev.detail.value;

				// dataProvider missing
				if (!this._dataProvider) {
					throw new Error('Typeahead: DataProvider not set. Make sure you use «typeahead.dataProvider = yourFunction;» where «yourFunction» is a function which takes the search query as an argument and returns a promise or result.');
				}

				// Perform search
				console.log('Typeahead: Call search on %o', this._dataProvider);
				this._dataProvider(value)
					.then(
						// Request succeeded
						(data) => {
							console.warn('Typeahead: Got back data %o for query %o', data, value);
							this._updateResults(data);

						}
						// Request failed
						, (err) => {
							console.warn('Typeahead: Data provider returned an error %o.', err);
							this._updateResults(err);
						});

			});

			// Focus
			input.addEventListener('focus-input', () => {
				this._showResults();
			});

			// Blur
			input.addEventListener('blur-input', () => {
				this._hideResults();
			});


		}


		/**
		* Hides results by adding the hidden attribute
		*/
		_hideResults() {
			this._resultList.setAttribute('hidden', '');
		}


		/**
		* Displays the results by removing the hiden attribute
		*/
		_showResults() {
			this._resultList.removeAttribute('hidden');
		}


		/**
		* Renders data by passing it to this._resultList
		*/
		_updateResults(data) {
			this._resultList.setData(data);
		}


	}

	window.customElements.define('typeahead-component', Typeahead);
	// Make component public for instantiation through JS
	window.TypeaheadComponent = Typeahead;

})();
