/**
 * Handles the custom combobox DOM elements creation
 */
var HM_Select_DOMCreation = {

	CSSClasses: {
		select:           ['o-select'],
		field: 		      ['o-select__field'],
        fieldBorder:      ['o-select__field-border'],
		trigger: 	      ['o-select__trigger'],
		menu: 		      ['c-menu','c-menu--limited'],
        menuItem:         ['c-menu__item']
	},

    /**
     * creates a new custom select related to the original one
     * @param  HTMLElement 	originalSelect
     * @return HTMLElement
     */
    createCustomSelectFrom: function (originalSelect) {
    	var select = this.createDOMElement('div', this.CSSClasses.select, {
    		'aria-atomic': 	'true',
        	'role':			'application'
    		}),
    		field = this.createField(originalSelect),
    		trigger =this.createTrigger(),
            selectID = originalSelect.id;

    	select.appendChild(field);
        select.appendChild(this.createDOMElement('div', this.CSSClasses.fieldBorder));
    	select.appendChild(trigger);
    	select.relatedOriginalSelect = originalSelect;
    	select.fieldChild = field;
    	select.triggerChild = trigger;

    	originalSelect.parentElement.insertBefore(select, originalSelect);

        if (selectID) {
            originalSelect.id = selectID + '_original';
            field.id = selectID;
        }

    	return select;
    },

    /**
     * creates the select field
     * @param  HTMLElement 	originalSelect
     * @return HTMLElement
     */
    createField: function (originalSelect) {
    	var field = this.createDOMElement('input', this.CSSClasses.field, {
    		'type'			: 'text',
    		'role'			: 'combobox',
    		'readonly'		: 'true',
    		'aria-readonly'	: 'false',
    		'tabindex'		: originalSelect.tabIndex
    	});

    	return field;
    },

    /**
     * creates the select trigger button
     * @return HTMLElement
     */
    createTrigger: function () {
        var trigger = this.createDOMElement('button', this.CSSClasses.trigger, {
        	'aria-hidden' 		: 	'true',
        	'tabIndex'			:   '-1'
        });

        return trigger;
    },

	/**
	 * creates all the DOM for the select options menus
	 * @param  HTMLElement originalSelect
	 * @return HTMLElement
	 */
    createCustomMenuFrom: function (originalSelect) {
    	var list = this.createDOMElement('ul', this.CSSClasses.menu, {
	    		'role' 			: 'listbox',
	        	'aria-expanded' : 'false'
	    	}),
    		n,
    		label,
    		menuItem,
    		itemAnchor;

 		for (order = 0; order < originalSelect.options.length; order ++) {
 			label = originalSelect.options[order].text;
 			menuItem = this.createDOMElement('li', this.CSSClasses.menuItem);
 			itemAnchor = this.createDOMElement('a', [], {
 				href		: '#' + order,
 				title 		: label,
 				tabindex 	: '-1'
 			});

 			itemAnchor.appendChild(document.createTextNode(label));
 			menuItem.appendChild(itemAnchor);
            list.appendChild(menuItem);
		}

        list.style.minWidth = originalSelect.offsetWidth + 'px';
        document.body.appendChild(list);

    	return list;
    },

    /**
     * returns a new DOM Element
     * @param  String 	tagType    	new element HTML tag type (div, a,...)
     * @param  Array 	classes    	(optional) append css classes to element
     * @param  Object 	attributes 	(optional) HTML attributes { attribute: 'value', ...}
     * @return HTMLElement 			new HTML element
     */
    createDOMElement: function (tagType, classes, attributes) {
    	var element = document.createElement(tagType);

    	if ((typeof classes === 'object') && (classes.length > 0)) {
    		[].forEach.call(classes, function (elementClass) {
    			element.classList.add(elementClass);
    		});
    	}

        this.assignAttributes(element, attributes);

    	return element;
    },

    /**
     * sets attributes using an object
     * @param  HTMLElement  element
     * @param  Object       attributes  HTML attributes { attribute: 'value', ...}
     */
    assignAttributes: function (element, attributes) {
        if (typeof attributes === 'object') {
            Object.keys(attributes).forEach(function (attribute) {
                element.setAttribute(attribute, attributes[attribute]);
            });
        }
    },

    /**
     * sets style properties using an object
     * @param  HTMLElement  element
     * @param  Object       properties  JS CSS properties { property: 'value', ...}
     */
    assignStyleProperties: function (element, properties) {
        if (typeof properties === 'object') {
            Object.keys(properties).forEach(function (property) {
                element.style[property] = properties[property];
            });
        }
    }

};