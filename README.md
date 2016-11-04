# Tagahead

## Intro

Tagahead is a JavaScript component to display **tag lists**, **typeaheads** and typeaheads with tag lists **(tagaheads)**.

The components are based on (and only on) upcoming standard web technologies ([Custom Elements v1](https://developers.google.com/web/fundamentals/getting-started/primers/customelements#addingmarkup), [HTML Imports](https://w3c.github.io/webcomponents/spec/imports/), [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)). 

The components are transpiled and merged in order to be **usable today**. 

## Usage

The example demonstrates the use of the typeahead component. 

### 1. Load the Component

Using a JavaScript script:

```html
<script src="/your/path/dist/typeahead/typeahead.js"></script>
```

Using a HTML import (currently supported in Chrome; can be polyfilled …)

```html
<link rel="import" href="/your/path/dist/typeahead/typeahead.html">
```

### 2. Include Component in your HTML Code

```html
<typeahead-component>
	<template id="result-template"><li>Name: [[name]]</li></template>
	<template id="error-template">Error: [[message]]</template>
	<template id="empty-result-set-template">No results found</template>
</typeahead-component>
```

The three templates with IDs `result-template`, `error-template` and `empty-result-set-template` are used to render the search results. `result-template` and `empty-result-set-template` are mandatory, `error-template` is optional.

Your data provider needs to return arrays which consists of objects (see below). The syntax `[[name]]` is used to display the properties of this object.

### Setup a Data Provider

Setup a data provider which fetches and returns the results for the user's input. 

- The data provider is a property of the typeahead
- The data provider is of type function
- The function takes one argument: The user's input
- It returns a Promise. The Promise resolves either to an array (may be empty) or an Error.

```javascript
const typeahead = document.querySelector('typeahead-component');
typeahead.dataProvider = (searchTerm) => {
	return new Promise((resolve, reject) => {
		// 10% of all requests are errors
		if (Math.random() < 0.1) return reject(new Error('Request failed'));
		// Successful request: Display two entries; if user entered «a», return objects with
		// name «a-1» and «a-2»
		return resolve([{ name: searchTerm + '-1' }, {name: searchTerm + '-2' }]);
	});
};
```

Or, in the old fashioned way:
```
TBD.
```


## Templates

- Arrays/Objects/Values
- undefined = '' – gracefully handled

