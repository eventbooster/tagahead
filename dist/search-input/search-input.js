/* global document, window, HTMLElement */

class SearchInput extends HTMLElement {

	constructor() {
		super();
	}

	connectedCallback() {

		const input = document.createElement('input');
		this.appendChild(input);
		this._addInputEventListener(input);

	}

	/**
	* Adds event listener to input, debounces, then emits _handleInputValueChange
	* if value changed.
	@param {HTMLInputElement} input		The input to observe
	*/
	_addInputEventListener(input) {
		
		let latestValue = input.value
			, debouncer;
		
		input.addEventListener('input', () => {

			if (debouncer) clearTimeout(debouncer);

			debouncer = setTimeout(() => {
				if (input.value === latestValue) return;
				latestValue = input.value;
				this._handleInputValueChange(input.value);
			}, 200);

		});

		input.addEventListener('keydown', (ev) => {
			console.error(ev);
		});

	}

	/**
	* Handles change of the value in the input
	* @param {String} value
	*/
	_handleInputValueChange(value) {
		console.error(value);
	}

}

window.customElements.define('search-input', SearchInput);
