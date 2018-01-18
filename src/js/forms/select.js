/**
 * Replaces browser native select menu
 */
function HM_Select() {
	this.optionSelectedClass = 'is--selected';
 	// Key codes
    this.KEY_ARROW_UP = 38;
    this.KEY_ARROW_DOWN = 40;
    this.KEY_ENTER = 13;
    this.KEY_SPACEBAR = 32;
    this.KEY_SCAPE = 27;

	this.onInit = function (applyTo) {
        var self = this,
        	select,
        	menu;

        [].forEach.call(applyTo, function (originalSelect) {
           select = HM_Select_DOMCreation.createCustomSelectFrom(originalSelect);
           menu = HM_Select_DOMCreation.createCustomMenuFrom(originalSelect);

           select.originalSelect = originalSelect;
           select.menu = menu;

           self.showSelectedValue(select);
           self.hideOriginal(originalSelect);
           self.handleEvents(select);
        });
    };

    /**
     * hides original select
     * @param  HTMLElement select
     */
    this.hideOriginal = function (select) {
 		select.setAttribute('aria-hidden', 'true');
        select.tabIndex = -1;
        HM_Select_DOMCreation.assignStyleProperties(select, {
        	border 				: '0px',
	        margin 				: '0px',
	        height 				: '1px',     // Safari fix
	        marginTop 			: '-1px',
	        padding 			: '0px',
	        webkitAppearance 	: 'none',  // Another Safari fix
	        display 			: 'block' // IE10 fix
        });
    };

    /**
     * handle the behaviour of the custom select via events
     *
     * - options menu appearance
     * - click on list item
     * - options selection
     *
     * @param  HTMLElement select
     */
    this.handleEvents = function (select) {
		this.handleMenuOptionsAppearance(select);
		this.handleClickOnListItem(select);
		this.handleOptionSelection(select);
        this.handleFocusState(select);
    };

    /**
     * controls the events which cause the menu to appear/disappear
     * @param  HTMLElement select
     */
    this.handleMenuOptionsAppearance = function (select) {
    	var self = this;

		select.overlayMenuModule = new HM_OverlayMenu();
		select.overlayMenuModule.bindEvents(select.fieldChild, select.menu);

		// Override hide on blur function
		select.overlayMenuModule.isBlurTargetOutside = function (target, menu, handler) {
	        var targetGrandParent = target.parentElement;

	        if (targetGrandParent) {
	            targetGrandParent = targetGrandParent.parentElement;
	        }

	        return ((target !== handler) && (targetGrandParent !== menu) && (target !== select.triggerChild));
	    };

	    // Override menu toggle in order to scroll to selected element
	    select.overlayMenuModule.toggle = function (menu, handler) {
            select.fieldChild.focus();
        	this.positionMenu(menu, handler);
            menu.style.minWidth = select.fieldChild.offsetWidth + 'px';
        	menu.setAttribute('aria-expanded', menu.classList.toggle(this.menuOpenedClass));
        	HM_Select_Option.scrollMenuIfNeeded(select, true);
    	};


    	select.triggerChild.addEventListener('click', function (event) {
    		event.preventDefault();
    		select.overlayMenuModule.toggle(select.menu, select.fieldChild);
    	});

    	select.fieldChild.addEventListener('keydown', function (event) {
    		if 	(event.keyCode === self.KEY_SPACEBAR) {
    			event.preventDefault();
	        	HM_Select_Option.scrollMenuIfNeeded(select, true);
    			select.overlayMenuModule.open(select.menu, select.fieldChild);
    		} else if (event.keyCode === self.KEY_SCAPE) {
    			select.overlayMenuModule.close(select.menu, select.fieldChild);
    		}
    	});
    };

    /**
     * controls the menu items click event
     * @param  HTMLElement select
     */
    this.handleClickOnListItem = function (select) {
    	var self = this;

    	[].forEach.call(select.menu.querySelectorAll('a'), function (menuLink) {
            menuLink.addEventListener('click', function (event) {
            	event.preventDefault();
            	select.originalSelect.selectedIndex = self._getOrderFormLink(this);
            	self.showSelectedValue(select);
            	HM_Select_Option.moveSelectionTo(select.originalSelect.selectedIndex, select);
            	select.overlayMenuModule.toggle(select.menu, select);
            });
        });
    };

    /**
     * handles all the events related to options menu item selection
     * @param  HTMLElement select
     */
	this.handleOptionSelection = function (select) {
		var self = this;

		select.previousSelection = null;
		select.searchBuffer = '';
		select.lastTimeType = 0;

		select.fieldChild.addEventListener('keydown', function (event) {
    		if 	(event.keyCode === self.KEY_ARROW_UP) {
    			event.preventDefault();
    			HM_Select_Option.moveSelectionToPrev(select);
    			self.showSelectedValue(select);

    		} else if (event.keyCode === self.KEY_ARROW_DOWN) {
    			event.preventDefault();
				HM_Select_Option.moveSelectionToNext(select);
				self.showSelectedValue(select);
    		} else {
    			HM_Select_Option.find(event.keyCode, select);
    		}
		});

		if (select.originalSelect.selectedIndex > -1) {
			HM_Select_Option.moveSelectionTo(select.originalSelect.selectedIndex, select);
		}
	};

    /**
     * avoid unstable focus state when mouse is down on list items or trigger
     * @param  HTMLElement select
     */
    this.handleFocusState = function (select) {
        var focusableElements = select.menu.querySelectorAll('a'),
            myLabel = this.findMyLabel(select.fieldChild);
            self = this;

        focusableElements = Array.prototype.slice.call(focusableElements);
        focusableElements.push(select.triggerChild);

        if (myLabel) {
            focusableElements.push(myLabel);
        }

        [].forEach.call(focusableElements, function (focusableElement) {
            focusableElement.addEventListener('mousedown', function (event) {
                event.preventDefault();
                select.fieldChild.focus();
            });
        });
    };

    /**
     * copies the original select selected value to the new custom
     * @param  HTMLElement select
     */
    this.showSelectedValue = function (select) {
    	var index = select.originalSelect.selectedIndex;

    	if (index > -1) {
        	select.fieldChild.value = select.originalSelect.options[index].text;
        }
	};

    /**
     * searchs for select label
     * @param  HTMLElement selectField
     * @return HTMLElement              Found label (HTMLElement), null if not found
     */
    this.findMyLabel = function (selectField) {
        var LabelFocus = new HM_LabelFocus();

        return LabelFocus.findMyLabel(selectField);
    };

	/**
	 * extract the option order from a menu link
	 * @param  HTMLElement linkElement
	 * @return int             			option number
	 */
	this._getOrderFormLink = function (linkElement) {
        return parseInt(linkElement.href.split('#').pop(), 10);
    };


}