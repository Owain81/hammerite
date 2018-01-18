/**
 * Controls the apparition of the overlay menu
 */
function HM_OverlayMenu() {
    this.handlerAttribute = 'data-handler-for-menu';
    this.menuOpenedClass = 'is--open';
    this.menuFromBottomClass = 'is--from-bottom';

    this.onInit = function (applyTo) {
        var self = this;

        [].forEach.call(applyTo, function (menuHandler) {
            var menuId = menuHandler.attributes[self.handlerAttribute].value,
        		menu = menuId ? document.getElementById(menuId) : null;

            if (menu) {
                self.moveMenuDOMOutside(menu);
                self.bindEvents(menuHandler, menu);
            }
        });
    };

    /**
     * Moves the menu DOM outside its parents. This way, it can be absolutely positioned,
     *  outside parent elements constraints
     * @param  HTMLElement menu
     */
    this.moveMenuDOMOutside = function (menu) {
        var fragment = document.createDocumentFragment();
        fragment.appendChild(menu);
        document.body.appendChild(fragment);
    };

    /**
     * binds click event for handler: overlay menu toggle
     * @param  HTMLElement handler
     * @param  HTMLElement menu
     */
    this.bindEvents = function (handler, menu) {
        var self = this;

        handler.addEventListener('click', function (e) {
            e.preventDefault();
            self.toggle(menu, handler);
        });

        handler.addEventListener('blur', function () {
            self.hideIfBlurOutside(menu, handler);
        });

        [].forEach.call(menu.querySelectorAll('a'), function (menuLink) {
            menuLink.addEventListener('blur', function () {
                self.hideIfBlurOutside(menu, handler);
            });
        });
    };

    /**
     * opens the menu
     * @param  HTMLElement menu
     * @param  HTMLElement handler
     */
    this.open = function (menu, handler) {
        this.positionMenu(menu, handler);
        menu.classList.add(this.menuOpenedClass);
        menu.setAttribute('aria-expanded', true);
    };

    /**
     * closes the menu
     * @param  HTMLElement menu
     * @param  HTMLElement handler
     */
    this.close = function (menu, handler) {
        menu.classList.remove(this.menuOpenedClass);
        menu.setAttribute('aria-expanded', false);
    };

    /**
     * open or close the menu
     * @param  HTMLElement menu
     * @param  HTMLElement handler
     */
    this.toggle = function (menu, handler) {
        this.positionMenu(menu, handler);
        menu.setAttribute('aria-expanded', menu.classList.toggle(this.menuOpenedClass));
    };

    /**
     * set the position for the menu based on handler position
     * @param  HTMLElement menu
     * @param  HTMLElement handler
     */
    this.positionMenu = function (menu, handler) {
        var handlerRect = handler.getBoundingClientRect(),
            top = handlerRect.top + handler.offsetHeight,
    		left = handlerRect.left;

        menu.style.transitionDuration = '0s';

        menu.style.top = (window.scrollY + top) + 'px';
        menu.style.left = (window.scrollX + left) + 'px';


        if (this.isOutOfBounds('vertical', menu)) {
            top = handlerRect.top - menu.offsetHeight;
            menu.style.top = (window.scrollY + top) + 'px';
            menu.classList.add(this.menuFromBottomClass);
        } else {
            menu.classList.remove(this.menuFromBottomClass);
        }

        if (this.isOutOfBounds('horizontal', menu)) {
            left = handlerRect.left + handler.offsetWidth - menu.offsetWidth;
            menu.style.left = (window.scrollX + left) + 'px';
        }

        menu.style.transitionDuration = '';
    };

    /**
     * tells if the menu is out of the screen bounds
     * @param  String  direction 	vertical/horizontal
     * @param  HTMLElement menu
     * @return {Boolean}           is out of bounds
     */
    this.isOutOfBounds = function (direction, menu) {
        var menuRect = menu.getBoundingClientRect(),
    		isOut = false,
    		upperSpace,
    		lowerSpace;

        if (direction === 'vertical') {
            upperSpace = menuRect.top;
            lowerSpace = window.innerHeight - menuRect.top;

            isOut = (menuRect.bottom > window.innerHeight) && (upperSpace > lowerSpace);
        }

        if (direction === 'horizontal') {
            isOut = menuRect.right > window.innerWidth;
        }

        return isOut;
    };

    /**
     * Hides the menu if the user clicks outside
     * @param  HTMLElement menu
     * @param  HTMLElement handler
     */
    this.hideIfBlurOutside = function (menu, handler) {
        var self = this;

        if (menu.classList.contains(this.menuOpenedClass)) {
            // firefox & IE don't refresh "document.activeElement" on blur, so a little delay is the only
            // way to tell if the field is losing focus inside the list or outside
            window.setTimeout(function () {
                if (self.isBlurTargetOutside(document.activeElement, menu, handler)) {
                    self.close(menu, handler);
                }
            }, 1);
        }
    };

    /**
     * checks if target element is outside the menu/handler
     * @param  HTMLElement target
     * @param  HTMLElement menu
     * @param  HTMLElement handler
     * @return {Boolean}         true if target is outside
     */
    this.isBlurTargetOutside = function (target, menu, handler) {
        var targetGrandParent = target.parentElement;

        if (targetGrandParent) {
            targetGrandParent = targetGrandParent.parentElement;
        }

        return ((target !== handler) && (targetGrandParent !== menu));
    };

}