/* global document, window, HTMLElement, CustomEvent */

(() => {

	/**
	* Input[type=text] for a typeahead/tagahead: 
	* - enables the user to input a value he's looking for (and fires «value-change» event if the input changed after
	*   a debounce)
	* - dispatches «navigate up» and «navigate down» events if ArrowDown/ArrowUp are pressed (needed for suggestions)
	* - dispatches «confirm-selection» if enter is pressed (needed for suggestions)
	*/
	class SearchInput extends HTMLElement {

		constructor() {
			super();
		}


		connectedCallback() {

			const input = document.createElement('input');
			input.setAttribute('size', 1);
			this.appendChild(input);
			this._addInputEventListener(input);
			this._autogrowInput(input);

		}


		/**
		* Adds event listener to input, debounces, then emits _handleInputValueChange
		* if value changed.
		* @param {HTMLInputElement} input		The input to observe
		*/
		_addInputEventListener(input) {
			
			let latestValue = input.value
				, debouncer;
			
			// Input: Debounce, then check if value changed.
			input.addEventListener('input', () => {

				if (debouncer) clearTimeout(debouncer);

				debouncer = setTimeout(() => {
					if (input.value === latestValue) return;
					latestValue = input.value;
					this._handleInputValueChange(input.value);
				}, 200);

			});

			// Dispatches events for enter, arrow up and down
			input.addEventListener('keydown', (ev) => {
				if (ev.key === 'ArrowDown') this.dispatchEvent(new CustomEvent('navigate-down'));
				if (ev.key === 'ArrowUp') this.dispatchEvent(new CustomEvent('navigate-up'));
				if (ev.key === 'Enter') {
					// Don't submit form
					ev.preventDefault(); 
					this.dispatchEvent(new CustomEvent('confirm-selection'));
				}
			});

			input.addEventListener('focus', () => {
				this.dispatchEvent(new CustomEvent('focus-input'));
			});

			input.addEventListener('blur', () => {
				this.dispatchEvent(new CustomEvent('blur-input'));
			});

		}


		/**
		* Set size of input to content + 1 (to hold next char that will be entered)
		* Todo: Might be improved by cloning the element; size doens't work perfectly.
		*/
		_autogrowInput(input) {
			input.addEventListener('keyup', () => {
				input.setAttribute('size', input.value.length + 1);
			});
		}


		/**
		* Handles change of the value in the input
		* @param {String} value
		*/
		_handleInputValueChange(value) {
			this.dispatchEvent(new CustomEvent('value-change', { detail: { value: value } }));
		}

	}

	window.customElements.define('typeahead-input', SearchInput);
	// Make class public for JS instantiation
	window.TypeaheadInput = SearchInput;

})();