/**
 * Sidebar component collapse and height handlers
 */
function HM_Sidebar () {
    this.sidebarClass = '{root}{component}sidebar';
    this.isOverflow = '{js-hooks}overflow';
    this.isMinified = '{js-hooks}minified';
    this.fixedTopBarClass = '{root}{component}topbar--fixed';
    this.isUnderFixedTopbar = '{root}{component}sidebar--under-topbar';

    this.onInit = function () {
        var self = this,
            sidenav,
            wrapper,
            toggle;
     
        this.prepareClasses();
        sidenav = this.findSidenav();
        wrapper = this.findWrapper();
        toggle = document.querySelector('.' + this.sidebarClass + '__header-toggle');

        if (toggle) {
            toggle.addEventListener('click', function (e) {
                [].map.call(document.querySelectorAll('.' + self.sidebarClass), function (el) {
                    el.classList.toggle(self.isMinified);
                });
            });
        }       

        wrapper.style.height = self.getHeight() + 'px';

        if (sidenav.offsetHeight > wrapper.offsetHeight) {
            wrapper.classList.add(self.isOverflow);
        }

        if (self.isFixedTopbarPresent()) {
            wrapper.parentElement.classList.add(self.isUnderFixedTopbar);
        }
    };

    this.prepareClasses = function () {
        this.isOverflow = HammeriteJS.replaceWithPrefixes(this.isOverflow);
        this.sidebarClass = HammeriteJS.replaceWithPrefixes(this.sidebarClass);
        this.isMinified = HammeriteJS.replaceWithPrefixes(this.isMinified);
        this.fixedTopBarClass = HammeriteJS.replaceWithPrefixes(this.fixedTopBarClass);
        this.isUnderFixedTopbar = HammeriteJS.replaceWithPrefixes(this.isUnderFixedTopbar);
    };

    this.findSidenav = function () {
        return document.getElementsByClassName(this.sidebarClass + '__nav')[0];
    };

    this.findWrapper = function () {
        return document.getElementsByClassName(this.sidebarClass + '__wrapper')[0];
    };

    this.getHeight = function () {
        var totalHeight,
            getTotalHeight,
            getFooter = document.getElementsByClassName(this.sidebarClass + '__footer')[0],
            getHeader = document.getElementsByClassName(this.sidebarClass + '__header')[0],
            headerHeight = (getHeader ? getHeader.offsetHeight : 0),
            footerHeight = (getFooter ? getFooter.offsetHeight : 0);

        getTotalHeight = document.documentElement.clientHeight;

        totalHeight = getTotalHeight - (footerHeight + headerHeight);

        return totalHeight;
    };

    this.isFixedTopbarPresent = function () {
        return (document.querySelector('.' + this.fixedTopBarClass) !== null);
    };
}