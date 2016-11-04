/**
* A very primitive function which renders a template – just pass in a template and 
* some data – and you're done. Uses extract-data to get data properties.
* Template is like: '<li>[[city.0.zip]]<br/>[[city.0.name]]</li>'
* 
*/
import getDataForPath from '../extract-data/extract-data.js';

function renderTemplate(template, data, openingTag = '[[', closingTag = ']]') {

	// Template must have the same amount of opening and closing tags
	if (template.split(openingTag).length !== template.split(closingTag).length) throw new Error('RenderTemplate: Template must have the same amount of opening and closing tags');
	
	const rendered = [];
	template.split(openingTag).forEach((tag, index) => {

		// First and last split do not never contain a tag
		if (!index) {
			rendered.push(tag);
			return;
		}

		// Get content of tag
		const split = tag.split(closingTag);

		// Tag not closed
		if (split.length !== 2) throw new Error('RenderTemplate: Tag is not closed before new tag begins');

		// Get value, put things together
		const value = getDataForPath(data, split[0].trim());
		rendered.push(value === undefined ? '' : value); // Don't ever push undefined; will be converted to «undefined»
		rendered.push(split[1]);

	});

	return rendered.join('');

}

export { renderTemplate as default };