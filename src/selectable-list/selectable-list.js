/* global HTMLElement, window */

(() => {


	/**
	* List that is attached to one or multiple elements which may emit the following events: 
	* - navigate-up (previous element is highlighted)
	* - navigate-down (next element is highlighted)
	* - confirm-selection (select currently highlighted element)
	* 
	* One element of the list (direct child) may be highlighted and is selected when it is clicked
	* or if the confirm-selection event is fired.
	*
	* Only makes sense using in combination with selectable-list-item.
	*/
	class SelectableList extends HTMLElement {

		constructor() {
			super();
			this._inputElements = [];
			this._currentlyHighlightedElementIndex = undefined;
		}


		connectedCallback() {
			console.log('SelectableList: Select first? %o', this.getAttribute('select-first'));
		}


		/**
		* Public method. Adds an input element whose events we listen to.
		*/
		addInput(element) {
			this._inputElements.push(element);
			this._addListenersToInput(element);
		}

		getInputs() {
			return this._inputElements;
		}


		/**
		* Downplays currently highlighted item
		*/
		_downplayItem(index) {
			if (index !== undefined && this.children.length) this.children[this._getValidIndex(index)].downplay();
		}


		/**
		* Highlights current element
		*/
		_highlightItem(index) {
			if (index !== undefined && this.children.length) this.children[this._getValidIndex(index)].highlight();			
		}


		/**
		* Checks if index is a valid index. If not, returns best guess
		*/
		_getValidIndex(index) {
			// Index too large
			if (index > this.children.length - 1) return this.children.length - 1;
			// Index too small
			if (index < 0) return 0;
			// All fine
			return index;
		}



		/**
		* Adds listeners for the supported events to a certain element 
		*/
		_addListenersToInput(input) {
			input.addEventListener('confirm-selection', () => {

				// No children
				if (!this.children.length) {
					console.log('SelectableList: Cannot select element, list length is 0.');
					return;
				}

				// Index not set
				if (this._currentlyHighlightedElementIndex === undefined) {
					console.log('SelectableList: Cannot select element, none is currently highlighted.');
					return;
				}

				// All fine
				this.children[this._getValidIndex(this._currentlyHighlightedElementIndex)].select();

			});



			input.addEventListener('navigate-up', () => {

				if (!this.children.length) return;

				this._downplayItem(this._currentlyHighlightedElementIndex);

				// None or first selected: Select last
				if (!this._currentlyHighlightedElementIndex) this._currentlyHighlightedElementIndex = this.children.length - 1;
				else this._currentlyHighlightedElementIndex--;

				this._highlightItem(this._currentlyHighlightedElementIndex);

			});



			input.addEventListener('navigate-down', () => {

				if (!this.children.length) return;

				this._downplayItem(this._currentlyHighlightedElementIndex);

				// None or last selected: Select last
				if (this._currentlyHighlightedElementIndex === undefined || this._currentlyHighlightedElementIndex >= this.children.length - 1) {
					this._currentlyHighlightedElementIndex = 0;
				}
				else this._currentlyHighlightedElementIndex++;

				this._highlightItem(this._currentlyHighlightedElementIndex);

			});


		}

	}

	window.customElements.define('selectable-list', SelectableList);
	// Make component public for instantiation through JS
	window.SelectableList = SelectableList;

})();
