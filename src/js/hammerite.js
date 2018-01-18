/*global window,document */


var HammeriteConfig = {
    'class-prefixes': {
        'root'      :   '',
        'helper'    :   'h-',
        'layout'    :   'l-',
        'object'    :   'o-',
        'component' :   'c-',
        'theming'   :   't-',
        'js-hooks'  :   'js-is-'
    },

    'self-name'     : 'designsystem',
    'sprite-path'   : '../images/icons/designsystem-sprite.svg'
};

/**
 * Add any JS module here.
 * Format: <module_name> : <apply to CSS selector>
 * @type {Object}
 */
var HammeriteModules = {
    'Input'                 :   '.{root}{object}input',
    'InputRange'            :   'input[type=range]',
    'EditableTableFocus'    :   '.{root}{component}table--editable .{root}{component}table--editable__input',
    'TextareaAutoheight'    :   'textarea[auto-resize]',
    'TextareaCounter'       :   'textarea[data-maxchars]',
    'Sidebar'               :   '.{root}{component}sidebar',
    'Tabs'                  :   '.{root}{component}tabs',
    'TabsSwipe'             :   '.{root}{component}tabs--fixed',
    'Icons'                 :   '.{root}{object}icon',
    'TopbarSearch'          :   '.{root}{component}topbar__toolbar',
    'OverlayMenu'           :   '[data-handler-for-menu]',
    'Select'                :   '.{root}{object}input--select:not([multiple])',
    'LabelFocus'            :   '.{root}{object}input,.{root}{object}input--select,.{root}{object}select__field'
};

/**
 * Wrapper for all modules
 * @type {Object}
 */
var HammeriteJS = {
    modules: {},
    globalListeners: {
        resize: []
    },

    init: function () {
        this.getSelfURL();
        this.initModules(HammeriteModules);
        this.bindGlobalListeners();
    },

    getSelfURL: function () {
        var self = this,
            scriptCalls = document.querySelectorAll('script');

        [].forEach.call(scriptCalls, function (scriptCall) {
            var scriptURL = scriptCall.src;

            if (scriptURL.toLowerCase().indexOf(HammeriteConfig['self-name']) !== -1) {
                self.URL = scriptURL.split('/').slice(0, -1).join('/') + '/';
            }
        });
    },

    initModules: function (modules) {
        var module;

        for (module in modules) {
            this.initIfPresent('HM_' + module, modules[module]);
        }
    },

    initIfPresent: function (moduleClass, cssSelector) {
        cssSelector = this.replaceWithPrefixes(cssSelector);
        var foundElements = document.querySelectorAll(cssSelector);

        if (foundElements.length > 0) {
            this.initModule(moduleClass, foundElements);
        }
    },

    initModule: function (moduleClass, applyToElements) {
        var moduleInstance;

        if (!this.modules[moduleClass]) {
            moduleInstance = new window[moduleClass]();
            moduleInstance.onInit(applyToElements);

            this.registerListenersForModule(moduleInstance);

            this.modules[moduleClass] = moduleInstance;
        }
    },

    registerListenersForModule: function (moduleInstance) {
        var event,
            eventName;

        for (event in this.globalListeners) {
            eventName = 'on' + event[0].toUpperCase() + event.substr(1);

            if (moduleInstance[eventName]) {

                this.globalListeners[event].push(function () {
                    moduleInstance[eventName]();
                });
            }
        }
    },

    bindGlobalListeners: function () {
        var self = this,
                event;

        for (event in this.globalListeners) {
            window.addEventListener(event, function () {
                    self.globalListeners[event].forEach(function (eventHandler) {
                        eventHandler();
                    });
            });
        }
    },

    replaceWithPrefixes: function (className) {
          var matches = className.match(/\{([^\}]+)\}/g);

        if (matches) {
            matches.forEach(function (match) {
                var prefixname = match.replace(/\{|\}/g, '');

                if (HammeriteConfig['class-prefixes'][prefixname] !== undefined) {
                    className = className.replace(match, HammeriteConfig['class-prefixes'][prefixname]);
                }
            });
        }

        return className;
    }

};

/**
 * Bootstrap
 */
window.addEventListener('DOMContentLoaded', function () {

    HammeriteJS.init();

});
