/**
 * Active tab logic
 */
function HM_Tabs() {
	this.tabClass = '{root}{component}tabs__tab';
    this.activeTabBarClass = this.tabClass + '-active-bar';
	this.activeClass = 'is--active';
    this.containers = [];

   	this.onInit = function (applyTo) {
        var self = this;

        self.tabClass = HammeriteJS.replaceWithPrefixes(self.tabClass);
        self.activeTabBarClass = HammeriteJS.replaceWithPrefixes(self.activeTabBarClass);

        self.containers = applyTo;

        [].forEach.call(self.containers, function (tabContainer) {
            self.createActiveTabBar(tabContainer);
            self.bindTabsListenersToContainer(tabContainer);
            self.setFirstTabActiveInto(tabContainer);
        });
    };

    this.onResize = function () {
        var self = this;

        [].forEach.call(self.containers, function (tabContainer) {
            self.resizeActiveBar(tabContainer);
        });
    };

    /**
     * creates a new DOM element for the active tab indicator inside the first tab
     * @param  HTMLElement  tabContainer
     */
    this.createActiveTabBar = function (tabContainer) {
        var newDOMelement = document.createElement('div');

        newDOMelement.classList.add(this.activeTabBarClass);
        this.getFirstTab(tabContainer).appendChild(newDOMelement);
    };

    /**
     * Attach the click listener to all the links inside tabContainer
     * @param  HTMLElement 	tabContainer
     */
    this.bindTabsListenersToContainer = function (tabContainer) {
        var self = this,
            tabs = tabContainer.querySelectorAll('.' + this.tabClass);

         [].forEach.call(tabs, function (tab) {
            self.listenClassChange(tabContainer, tab);
            self.listenAnchorClick(tabContainer, tab);
         });
    };

    /**
     * adds a listener to 'tab' in order to detect class changes
     * @param  HTMLElement tabContainer
     * @param  HTMLElement tab
     */
    this.listenClassChange = function (tabContainer, tab) {
        var self = this;

        tab.classChangeObserver = new MutationObserver(function (changeRecords) {
            self.grantActiveListener(tabContainer, changeRecords);
        });

        tab.classChangeObserver.observe(tab, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
    };

    /**
     * listen to 'active' class grant. It's needed to be performed this way in case the 'active' is granted using
     * another script.
     * @param  changeRecords   Observer change records
     */
    this.grantActiveListener = function (tabContainer, changeRecords) {
        var self = this;

        changeRecords.forEach(function (record) {
            var newClass = record.target.attributes['class'].value;

            if (newClass.indexOf(self.activeClass) !== -1) {
                self.moveActiveBarTo(tabContainer, record.target);
            }
        });
    };

    /**
     * Adds click listener to tab anchor
     * @param  HTMLElement tabContainer
     * @param  HTMLElement tab
     */
    this.listenAnchorClick = function (tabContainer, tab) {
        var self = this;

         tab.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            self.moveActiveTo(tab, tabContainer);
            return false;
        }, false);
    };

    /**
     * translate the 'active bar' to the new active tab
     * @param  HTMLElement tab
     */
    this.moveActiveBarTo = function (tabContainer, tab) {
        var tabOffset = tab.offsetLeft,
            tabWidth = tab.offsetWidth,
            firstTab = tabContainer.querySelector('.' + this.tabClass),
            firstTabOffset = firstTab.offsetLeft;

        this.updateActiveBar(tabContainer, tabOffset - firstTabOffset, tabWidth);
    };

    /**
     * update active bar properties
     * @param  HTMLElement  tabContainer
     * @param  integer      offset
     * @param  integer      width
     */
    this.updateActiveBar = function (tabContainer, offset, width) {
        var activeTabBar = tabContainer.querySelector('.' + this.activeTabBarClass);

        activeTabBar.setAttribute('style', 'transform: translateX(' + offset + 'px); width: ' + width + 'px;');
    };

    /**
     * resizes the active bar
     * @param  HTMLElement  tabContainer
     */
    this.resizeActiveBar = function (tabContainer) {
        this.moveActiveBarTo(tabContainer, this.getActiveTab(tabContainer));
    };

    /**
     * Grant 'active' to the first tab
     * @param  HTMLElement 	tabContainer
     */
    this.setFirstTabActiveInto = function (tabContainer) {
		if (this.getActiveTab(tabContainer) === null) {
			tabContainer.querySelector('.' + this.tabClass).classList.add(this.activeClass);
		}
    };

    /**
     * Returns the active tab
     * @param  HTMLElement 	tabContainer
     * @return HTMLElement            		Active tab
     */
    this.getActiveTab = function (tabContainer) {
    	return tabContainer.querySelector('.' + this.tabClass + '.' + this.activeClass);
    };

    /**
     * returns the first tab inside a tab container
     * @param  HTMLElement  tabContainer
     * @return HTMLElement                  First tab
     */
    this.getFirstTab = function (tabContainer) {
        return tabContainer.querySelector('.' + this.tabClass);
    };

    /**
     * Removes 'active' class to the current active tab, and set it to the
     * new active tab
     * @param  HTMLElement 	anchor       New active tab
     * @param  HTMLElement 	tabContainer
     */
    this.moveActiveTo = function (anchor, tabContainer) {
    	var currentActive = this.getActiveTab(tabContainer);

    	if (currentActive !== null) {
    		currentActive.classList.remove(this.activeClass);
    	}

    	anchor.classList.add(this.activeClass);
    };

}