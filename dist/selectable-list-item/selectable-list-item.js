/* global HTMLElement, window, CustomEvent */

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
	* When an element is selected, a select-item event is fired with a detail property that contains
	* - text: 	the element's text value
	* - data: 	the element's data
	*/
	class SelectableListItem extends HTMLElement {


		constructor() {
			super();
			this._highlightedClassName = 'highlight';
		}

		connectedCallback() {
			this._addClickEventListener();
		}


		/**
		* Listens to click, dispatches select-item event
		*/
		_addClickEventListener() {
			this.addEventListener('mousedown', () => {
				console.log('SelectableListItem: Clicked item.');
				this._fireSelection();
			});
		}

		/**
		* Highlight the current element
		*/
		highlight() {
			this.classList.add(this._highlightedClassName);
		}

		/**
		* Opposite of highlight
		*/
		downplay() {
			this.classList.remove(this._highlightedClassName);
		}

		/**
		* Fires/dispatches select-item event.
		*/
		_fireSelection() {
			const eventData = {
				bubbles			: true
			};
			this.dispatchEvent(new CustomEvent('select-item', eventData));
		}

		/**
		* Public method, mainly implemented by selectable list. Fires select-item event.
		*/
		select() {
			this._fireSelection();
		}

	}

	window.customElements.define('selectable-list-item', SelectableListItem);
	// Make component public for instantiation through JS
	window.SelectableListItem = SelectableListItem;

})();
