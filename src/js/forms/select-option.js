/**
 * Handles the menu list option selection
 */
var HM_Select_Option = {
    searchTimeLimit: 0.7,
	optionSelectedClass: 'is--selected',

    /**
     * finds and select an option using keystrokes
     * @param  char         charCode
     * @param  HTMLElement  select
     */
    find: function (charCode, select) {
        this._addToSearchBuffer(charCode, select);

        index = this.searchOption(select.searchBuffer, select.originalSelect);

        if (index !== -1) {
            this.moveSelectionTo(index, select);
        }
    },

    /**
     * searchs for an option
     * @param  String       searchTerm
     * @param  HTMLElement  select
     * @return int          option index, -1 if not found
     */
    searchOption: function (searchTerm, select) {
        var found = false,
            bufferLen = searchTerm.length,
            optionText,
            n = 0;

        while (!found && n < select.options.length) {
            optionText = select.options[n].text;
            if (optionText.substr(0, bufferLen) === searchTerm) {
                found = true;
            } else {
                n++;
            }
        }

        return (found ? n : -1);
    },

    /**
     * removes the selected class for all the items
     * @param  HTMLElement menu
     */
    deselectAll: function (menu) {
        var self = this;

        [].forEach.call(menu.querySelectorAll('li'), function (menuItem) {
            menuItem.classList.remove(self.optionSelectedClass);
        });
    },

    /**
     * moves the selection to option #order
     * @param  int          order
     * @param  HTMLElement  select
     */
    moveSelectionTo: function (order, select) {
        var optionItem = select.menu.querySelectorAll('li')[order];
        if (optionItem) {
            select.originalSelect.selectedIndex = order;
            select.fieldChild.value = select.originalSelect.options[order].text;
            this.deselectAll(select.menu);
            optionItem.classList.add(this.optionSelectedClass);
            this.scrollMenuIfNeeded(select);
        }
    },

    /**
     * selects previous option
     * @param  HTMLElement  select
     */
    moveSelectionToPrev: function (select) {
        var order = select.originalSelect.selectedIndex - 1;

        if (order > -1) {
            this.moveSelectionTo(order, select);
        }
    },

    /**
     * selects next option
     * @param  HTMLElement  select
     */
    moveSelectionToNext: function (select) {
        var order = select.originalSelect.selectedIndex + 1;

        if (order < select.originalSelect.options.length) {
            this.moveSelectionTo(order, select);
        }
    },

    /**
     * changes menu scroll if selected element is not visible
     * @param  HTMLElement  select
     * @param  boolean      scrollToCenter (optional) if true, centers the item into the visible part
     */
    scrollMenuIfNeeded: function (select, scrollToCenter) {
        var topScroll = select.menu.scrollTop,
            menuHeight = select.menu.offsetHeight,
            visiblePart = topScroll + menuHeight,
            selectedItem =  select.menu.querySelector('li.' + this.optionSelectedClass),
            selectedItemPositionTop = selectedItem.offsetTop,
            selectedItemHeight = selectedItem.offsetHeight,
            selectedItemPositionBottom = selectedItemPositionTop + selectedItemHeight;

        if ((typeof scrollToCenter === 'boolean') && scrollToCenter) {

            if ((selectedItemPositionBottom > visiblePart) || (selectedItemPositionTop < topScroll)) {
                select.menu.scrollTop = selectedItemPositionTop - Math.floor(menuHeight / 2);
            }

        } else {
            if (selectedItemPositionBottom > visiblePart) {
                select.menu.scrollTop = topScroll + selectedItemHeight;
            }

            if (selectedItemPositionTop < topScroll) {
                select.menu.scrollTop = selectedItemPositionTop;
            }
        }
    },

    /**
     * adds a new char to the search buffer
     * @param  char         charCode
     * @param  HTMLElement  select
     */
    _addToSearchBuffer: function (charCode, select) {
        if (this._searchTimeExceeded(select.lastTimeTyped)) {
            select.searchBuffer = '';
        }

        select.searchBuffer += String.fromCharCode(charCode);
        select.lastTimeTyped = new Date().getTime();

    },

    /**
     * Tells if the time between keystrokes is over the limit
     * @param  int      lastTimeTyped
     * @return boolean
     */
    _searchTimeExceeded: function (lastTimeTyped) {
        var mSecondsLimit = this.searchTimeLimit * 1000,
            currentTime = new Date().getTime();

        return ((currentTime - lastTimeTyped) > mSecondsLimit);
    }
};