/**
 * Toggle topbar search field
 */
function HM_TopbarSearch() {
    this.extendedSearchClass = 'is--search-expanded';
    this.toggleHandler = '.{root}{component}topbar__search .{root}{component}topbar__link';
    this.titleClass = '.{root}{component}topbar__link-title';

    this.onInit = function (applyTo) {
        var self = this;

        this.toggleHandler = HammeriteJS.replaceWithPrefixes(this.toggleHandler);
        this.titleClass = HammeriteJS.replaceWithPrefixes(this.titleClass);

        [].forEach.call(applyTo, function (topBarToolBar) {
        	var searchHandler = topBarToolBar.querySelector(self.toggleHandler);
			searchHandler.parentToolbar = topBarToolBar;

        	if (searchHandler) {
				searchHandler.addEventListener('click', function (e) {
    				e.preventDefault();
        			self.toggleSearchExpand(searchHandler, topBarToolBar);
        		});
        	}
        });
    };

    /**
     * expands or collapses the search input
     * @param  HTMLElement searchHandler
     * @param  HTMLElement topBarToolBar
     */
    this.toggleSearchExpand = function (searchHandler, topBarToolBar) {
		if (!this.isSearchExpanded(searchHandler)) {
			this.resetItemsWidth(topBarToolBar);
			this.setFixedWidthToItems(topBarToolBar);
			this.focusSearchInput(searchHandler);
		}

		searchHandler.parentToolbar.classList.toggle(this.extendedSearchClass);
    };

    /**
     * checks if seach input is expanded
     * @param  HTMLElement searchHandler
     * @return {Boolean}
     */
    this.isSearchExpanded = function (searchHandler) {
    	return searchHandler.parentToolbar.classList.contains(this.extendedSearchClass);
    };

    /**
     * topbar items width needs to be fixed (not auto) for css transition
     * @param  HTMLElement topBarToolBar
     */
    this.setFixedWidthToItems = function (topBarToolBar) {
    	this.setWidthForAllTitles(topBarToolBar, function (title) {
    		return title.offsetWidth + 'px';
    	});
    };

    /**
     * removes the fixed width from topbar items
     * @param  HTMLElement topBarToolBar
     */
    this.resetItemsWidth = function (topBarToolBar) {
    	this.setWidthForAllTitles(topBarToolBar, function (title) {
    		return '';
    	});
    };

    /**
     * sets style="width: ..." for all toolbar titles
     * @param  {[type]} topBarToolBar [description]
     * @param  {[type]} styleCallBack [description]
     * @return {[type]}               [description]
     */
    this.setWidthForAllTitles = function (topBarToolBar, widthCallBack) {
    	var titles = topBarToolBar.querySelectorAll(this.titleClass);

    	[].forEach.call(titles, function (title) {
    		title.style.width = widthCallBack(title);
    	});
    };

    /**
     * focuses the seach input
     * @param  HTMLElement searchHandler
     */
    this.focusSearchInput = function (searchHandler) {
    	var inputElement = searchHandler.nextElementSibling.parentElement.querySelector('input');

    	if (inputElement) {
    		inputElement.focus();
    	}
    };
}