/**
 * Adds a counter to a textarea if 'data-maxchars' is present
 */
function HM_TextareaCounter () {

    this.counterClass = '{root}{object}text-count';

    this.onInit = function (textareas) {
        var self = this;
        self.counterClass = HammeriteJS.replaceWithPrefixes(self.counterClass);

        [].forEach.call(textareas, function (textarea) {
            if (textarea.getAttribute('data-maxchars') !== null) {
                self.attachRelatedElements(textarea);
                self.updateCounter(textarea);
                self.bindEvents(textarea);
            }
        });
    };

    this.bindEvents = function (textarea) {
        var self = this,
            listener = function () {
                self.updateCounter(textarea);
            };

        textarea.addEventListener('input', listener, false);
        textarea.addEventListener('change', listener, false);
    };

    this.attachRelatedElements = function (textarea) {
        textarea.counter = textarea.parentElement.nextElementSibling;
        textarea.textAreaLabel = document.querySelector('label[for="' + textarea.id + '"]');
    };

    this.updateCounter = function (textarea) {
        var maxchars = textarea.getAttribute('data-maxchars'),
            charsCount = textarea.value.length;

        if (textarea.counter.classList.contains(this.counterClass)) {
            // Update value
            textarea.counter.innerHTML = (maxchars - charsCount) + "/" + maxchars + " characters";

            // Set styles
            if (charsCount > maxchars) {
                // Exceeding max
                this.setStylesForLimitExceeded(textarea);
            } else if ((maxchars - charsCount) <= 20 & (maxchars - charsCount) >= 0) {
                // Approaching max
                this.setStylesForLimitApproaching(textarea);

            } else {
                // Safe range
                this.setStylesForLimitDefault(textarea);
            }
        }
    };

    this.setStylesForLimitExceeded = function (textarea) {
        this.removeAllClasses(textarea);
        this.addClassIfNotExists(textarea.counter, this.counterClass + '--wrong');
        this.addClassIfNotExists(textarea, 'is-error');
        this.addClassIfNotExists(textarea.textAreaLabel, 'is-error');
        textarea.validity.tooLong = true;
    };

    this.setStylesForLimitApproaching = function (textarea) {
        this.removeAllClasses(textarea);
        this.addClassIfNotExists(textarea.counter, this.counterClass + '--warning');
        this.addClassIfNotExists(textarea, 'is-warning');
        this.addClassIfNotExists(textarea.textAreaLabel, 'is-warning');

        textarea.validity.tooLong = false;
    };

    this.setStylesForLimitDefault = function (textarea) {
        this.removeAllClasses(textarea);
        textarea.validity.tooLong = false;
    };

    this.removeAllClasses = function (textarea) {
        this.removeClassIfExists(textarea.counter, this.counterClass + '--warning');
        this.removeClassIfExists(textarea.counter, this.counterClass + '--wrong');
        this.removeClassIfExists(textarea.textAreaLabel, 'is-warning');
        this.removeClassIfExists(textarea.textAreaLabel, 'is-error');
        this.removeClassIfExists(textarea, 'is-error');
        this.removeClassIfExists(textarea, 'is-warning');
    };

    this.addClassIfNotExists = function (node, className) {
        !node.classList.contains(className) ? node.classList.add(className) : "";
    };

    this.removeClassIfExists = function (node, className) {
        node.classList.contains(className) ? node.classList.remove(className) : "";
    };
}