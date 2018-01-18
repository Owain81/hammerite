/**
 * Fixed tabs swipe handler
 */
function HM_TabsSwipe() {
    /**
     * max width for swipe scroll in pixels
     * @type String
     */
    this.swipeBreakPoint = '640px';
    this.allContainers = [];

    this.onInit = function (tabContainers) {
        this.allContainers = tabContainers;
        this.allContainers.forEach(function (tabContainer) {
            tabContainer.swipeScroll = new HM_swipeScroll();
            tabContainer.swipeScroll.init(tabContainer);
        });

        this.apply();
     };

     this.onResize = function () {
        this.apply();
     };

    this.apply = function () {
        var self = this;

        this.allContainers.forEach(function (tabContainer) {
            if (window.matchMedia('(max-width: ' + self.swipeBreakPoint + ')').matches) {
                tabContainer.swipeScroll.apply();
            } else {
                tabContainer.swipeScroll.remove();
            }
        });
    };
}



var HM_swipeScroll = function () {
    return {

        /* ===== Constants ===== */

        /**
         * class to add when the container needs scroll
         * @type String
         */
        overflowClass: '{component}tabs--with-scroll',

        /**
         * class to add when the container IS scrolling
         * @type String
         */
        scrollingClass: '{component}tabs--scrolling',

        /**
         * Class name for gradients overlay
         * @type String
         */
        gradientOverlayClass: '{component}tabs__scroll-overlay',
        /**
         * Apply swipe scroll from # of tabs
         * @type Number
         */
        addScrollFrom: 3,

        /**
         * Show part of the next tab (%)
         * @type Number
         */
        visiblePartPercent: 50,

        /**
         * Tab bar swipe margins (%)
         * @type Number
         */
        dragMarginsPercent: 40,

        /**
         * Minimum offset for swipe (px)
         * @type Number
         */
        swipeMinOffset: 15,

        /**
         * Swipe inertia (high values -> more inertia)
         * @type Number
         */
        inertiaFactor: 0.2,

        /* ===== Properties ===== */
        container: null,
        gradientOverlay: {
            container: null,
            left: null,
            right: null
        },

        n: 0,
        tabWidth: 0,
        dragMargins: 0,
        allowSwipe: false,

        position: 0,

        touch: {
            isSwipe: false,
            started: false,
            startPoint: null,
            diff: null,
            last: null,
            speed: null
        },

        /* ===== Methods ===== */

        /**
         * Initializes a container element
         * @param  DOMelement container
         */
        init: function (container) {
            this.overflowClass = HammeriteJS.replaceWithPrefixes(this.overflowClass);
            this.scrollingClass = HammeriteJS.replaceWithPrefixes(this.scrollingClass);
            this.gradientOverlayClass = HammeriteJS.replaceWithPrefixes(this.gradientOverlayClass);

            this.container = container;
            this.n = container.querySelectorAll('li').length;

            this.createOverlayGradients();
            this.bindSwipeEventListeners();
            this.bindTabEvents();
        },

        /**
         * Applies the swipe behaviour to the container if it has a number
         * of child tabs over the limit
         */
        apply: function () {
            if (this.n > this.addScrollFrom) {
                this.position = 0;
                this.container.style.width = this.containerWidth() + '%';
                this.tabWidth = this.container.querySelector('li').offsetWidth;
                this.dragMargins =  Math.ceil( this.tabWidth * (this.dragMarginsPercent / 100));
                this.container.style.padding = '0 ' + this.dragMargins + 'px';
                this.container.style.transform = 'translateX(-' + this.dragMargins + 'px)';
                this.container.classList.add(this.overflowClass);
                this.container.classList.add(this.scrollingClass);
                this.moveOverlayGradients(this.dragMargins);
                this.allowSwipe = true;
            }
        },

        /**
         * Removes the swipe behaviour
         */
        remove: function () {
            this.container.classList.remove(this.overflowClass);
            this.container.style.width = '';
            this.container.style.padding = '';
            this.container.style.transform = 'translateX(0)';
            this.allowSwipe = false;
        },

        /**
         * Calculates the container width percent
         * @return Number container width percent
         */
        containerWidth: function () {
           var visibleTabs = this.addScrollFrom + this.visiblePartPercent / 100,
               tabWidthPercent = 100 / visibleTabs;

            return tabWidthPercent * this.n;
        },

        /**
         * Add the new DOM elements for the gradient overlays
         */
        createOverlayGradients: function () {
            this.gradientOverlay.container = this.createElementWithClass('div', this.gradientOverlayClass);
            this.gradientOverlay.left = this.createElementWithClass('span', this.gradientOverlayClass + '__left');
            this.gradientOverlay.right = this.createElementWithClass('span', this.gradientOverlayClass + '__right');

            this.gradientOverlay.container.appendChild(this.gradientOverlay.left);
            this.gradientOverlay.container.appendChild(this.gradientOverlay.right);
            this.container.appendChild(this.gradientOverlay.container);
        },

        /**
         * Create an element with a CSS class
         * @param  string elementType HTML tag name
         * @param  string className   CSS class name
         * @return DOMelement
         */
        createElementWithClass: function (elementType, className) {
            var element = document.createElement(elementType);
            element.className = className;
            return element;
        },

        /**
         * Translate the gradient overlay
         * @param  Number offset
         */
        moveOverlayGradients: function(offset) {
            var showLeftMin = this.dragMargins,
                showRightMin = this.container.offsetWidth - document.body.clientWidth - this.dragMargins,
                showClass = 'show';

            this.gradientOverlay.container.style.transform = 'translateX(' + offset + 'px)';

            this.addOrRemoveClass(offset > showLeftMin, this.gradientOverlay.left, showClass);
            this.addOrRemoveClass(offset < showRightMin, this.gradientOverlay.right, showClass);
        },

        /**
         * Adds or removes a CSS class using a condition
         * @param bool          addOrRemove condition
         * @param DOMelement    element     DOM element
         * @param string        className   CSS class
         */
        addOrRemoveClass: function (addOrRemove, element, className) {
            if (addOrRemove) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        },

        /**
         * Binds the swipe event listeners to the container
         */
        bindSwipeEventListeners: function () {
            var me = this;

            this.bindEvents(['touchstart','MSPointerDown'], function (e) {
                if (me.allowSwipe) {
                    me.startTouchListener(e);
                }
            });
            this.bindEvents(['touchmove', 'MSPointerMove'], function (e) {
                if (me.allowSwipe) {
                    me.moveTouchListener(e);
                }
            });
            this.bindEvents(['touchend', 'MSPointerUp'], function (e) {
                if (me.allowSwipe) {
                    me.endTouchListener(e);
                }
            });

            // avoid drag action for MS devices
            this.container.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            }, false);
         },

         /**
          * Bind events for tabs
          */
         bindTabEvents: function () {
            var self = this,
                allTabs = this.container.querySelectorAll('a'),
                n = 0,
                listener;

            listener = function (e) {
                if (self.allowSwipe) {
                    self.centerTo(this.swipeIndex);
                }
            };

            for (n = 0; n < allTabs.length; n++) {
                allTabs[n].swipeIndex = n;
                allTabs[n].addEventListener('click', listener, false);
                allTabs[n].addEventListener('focus', listener, false);
            }
         },

         /**
          * Bind severals events with the same listener
          * @param  array       events      event names array
          * @param  function    listener    listener function
          */
         bindEvents: function (events, listener) {
            for(var event in events) {
                this.container.addEventListener(events[event], listener, false);
            }
         },

         /**
          * Listener for swipe start
          * @param  object e event
          */
         startTouchListener: function (e) {
            this.container.classList.add(this.scrollingClass);
            this.touch.last = this.touch.startPoint = this.getTouchX(e);
            this.touch.isSwipe = false;
            this.touch.started = true;
         },

         /**
          * Listener for swipe move
          * @param  object e event
          */
         moveTouchListener: function (e) {
            if (this.touch.started) {
                var touchX = this.getTouchX(e);

                this.touch.diff = this.touch.startPoint - touchX;
                this.touch.speed = this.touch.last - touchX;
                this.touch.last = touchX;

                if ((Math.abs(this.touch.diff) > this.swipeMinOffset) || this.touch.isSwipe) {
                    this.move(this.touch.diff, false);
                    this.touch.isSwipe = true;
                }
            }
         },

         /**
          * Listener for swipe end
          * @param  object e event
          */
         endTouchListener: function () {
            this.container.classList.remove(this.scrollingClass);
            if (this.touch.isSwipe) {
                this.move(this.touch.diff, true);
            }
            this.touch.started = false;
         },

         /**
          * returns touch X position
          * @param  object  e   browser event object
          * @return Number      X position
          */
         getTouchX: function (e) {
            if (e.touches) {
                return e.touches[0].clientX;
            } else {
                return e.clientX;
            }
         },

         /**
          * Moves the container relative to its current position
          * @param  number      offset
          * @param  bool        release     tells if the swipe is ending
          */
         move: function (offset, release) {
            var newPosition,
                speedOffset = 0;

            if (!release) {
                newPosition = this.limit(this.position - offset, true);
            } else {
                speedOffset = Math.ceil((this.touch.speed - 1) * this.tabWidth * this.inertiaFactor);
                newPosition = this.position = this.adjustToTab(this.position - offset - speedOffset);
            }

            this.translateContainer(newPosition, false);
         },

         /**
          * Returns a position into the container bounds
          * @param  Number      position    new position
          * @param  bool        addMargins  take the drag margins into account
          * @return Number                  position into the bounds
          */
         limit: function (position, addMargins) {
            var margins = addMargins ? 0 : this.dragMargins,
                upper = -margins,
                lower = - this.container.offsetWidth + document.body.clientWidth + margins;

            if (position > upper) {
                position = upper;
            } else if (position < lower) {
                position = lower;
            }
            return position;
         },

         /**
          * Moves the container to a new position
          * @param  number      position        new position
          * @param  bool        fixPosition     set the new position as current
          */
         translateContainer: function (position, fixPosition) {
            this.container.style.transform = 'translateX(' + position + 'px)';
            this.moveOverlayGradients(-position);

            if (fixPosition) {
                this.position = position;
            }
        },

         /**
          * returns a position adjusted to any tab begin position
          * @param  Number      position    new position
          * @return Number                  position according to the tabs positions
          */
         adjustToTab: function (position) {
            var index = Math.round((position + this.dragMargins) / this.tabWidth);

            return this.limit(index * this.tabWidth - this.dragMargins, false);
         },

         /**
          * Centers the tab tar in tab #index
          * @param  Number index tab number (0,1,...)
          */
         centerTo: function (index) {
            var position = this.tabWidth * index;

            position += Math.floor(this.tabWidth / 2) + 1;
            position += this.dragMargins;
            position -= Math.floor(document.body.clientWidth / 2);
            this.container.classList.remove(this.scrollingClass);
            this.translateContainer(this.adjustToTab(-position), true);
         }
    };
};