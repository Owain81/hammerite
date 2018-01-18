/**
 * Adjust the textarea height dynamically if 'auto-resize' attribute is present
 */
function HM_TextareaAutoheight () {

    this.isMSIE = 0;
    this.allTextareas = [];
    this.eventsBinded = false;

    this.onInit = function (textareas) {
        this.allTextareas = textareas;
        this.detectMSIE();
        this.addCSS();
        this.adjustAll();
    };

    this.onResize = function () {
        this.adjustAll();
    };

    this.bindEvents = function (node) {
        var self = this,
            listener = function () {
                self.adjust(this);
            };

        // user input, copy, paste, cut occurrences
        node.addEventListener('input', listener, false);
        node.addEventListener('change', listener, false);
    };

    this.detectMSIE = function () {
        this.isMSIE = +((/msie (\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);

        if (isNaN(this.isMSIE)) {
            this.isMSIE = +((/trident\/.*; rv:(\d+)/.exec(navigator.userAgent.toLowerCase()) || [])[1]);
        }
    };

    this.adjustAll = function () {
        var self = this;

        this.allTextareas.forEach(function (textarea) {
            self.adjust(textarea);
            if (!self.eventsBinded) {
                self.bindEvents(textarea);
            }
        });

        this.eventsBinded = true;
    };

    this.adjust = function (node) {
        var lineHeight = this.getLineHeight(node);

        if (!(node.offsetHeight || node.offsetWidth)) {
            return;
        }

        if (node.scrollHeight <= node.clientHeight) {
            node.style.height = '0px';
        }

        var h = node.scrollHeight + // actual height defined by content
                node.offsetHeight - // border size compensation
                node.clientHeight; //       -- || --

        node.style.height = Math.max(h, lineHeight) +
                    (this.isMSIE && lineHeight ? lineHeight : 0) + // ie extra row
                    'px';
    };

    this.addCSS = function () {
        var style = document.createElement('style');
        style.innerHTML = '[auto-resize] {overflow: hidden; resize: none; box-sizing: border-box;}';
        document.head.appendChild(style);
    };

    this.getLineHeight = function (node) {
        var computedStyle = window.getComputedStyle(node),
            lineHeightStyle = computedStyle.lineHeight;

        if (lineHeightStyle === 'normal') {
            return +computedStyle.fontSize.slice(0, -2);
        } else {
            return +lineHeightStyle.slice(0, -2);
        }
    };

}