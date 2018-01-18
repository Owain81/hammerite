/**
 * Extends the input elements
 *
 *  - Wrap the original input element with a div
 *  - Extracts the placeholder
 *  - Creates the validation icon element
 *  - Adds placeholder and validation logic
 */
function HM_Input() {

    this.inputRootClass = '{root}{object}input';
    this.wrapperClass = '__wrap';
    this.borderClass = '__border';
    this.placeholderClass = '__placeholder';
    this.placeholderHiddenClass = 'is--hidden';
    this.validationIconClass = '__validation-icon';
    this.justRemovedClassSuffix = '-just-removed';
    this.validationClasses = ['is-error', 'is-warning', 'is-success', 'is-info'];
    this.validationAnimationTime = 250;


    this.onInit = function (applyTo) {
        var self = this;

        this.prepareClasses();

        [].forEach.call(applyTo, function (inputElement) {
            if (self.shouldApply(inputElement.type)) {
                var inputWrapper = self.wrapInputElement(inputElement);
                var placeholderElement;

                self.createInputBorderInto(inputWrapper);
                placeholderElement = self.createExternalPlaceholderInto(inputWrapper);
                self.createValidationIconFor(inputWrapper);

                self.setPlaceholderLogicRelatedTo(inputWrapper.input, placeholderElement);
                self.bindClassRemovalListenerTo(inputWrapper.input);
            }
        });
    };

    /**
     * Complete classes with the input root class
     */
    this.prepareClasses = function () {
        this.inputRootClass = HammeriteJS.replaceWithPrefixes(this.inputRootClass);
        this.wrapperClass = this.inputRootClass + this.wrapperClass;
        this.borderClass = this.inputRootClass + this.borderClass;
        this.placeholderClass = this.inputRootClass + this.placeholderClass;
        this.validationIconClass = this.inputRootClass + this.validationIconClass;
    };

    /**
     * tells if the modifications should be applied for this input type
     * @param  String   inputType
     * @return Boolean
     */
    this.shouldApply = function (inputType) {
        return  (inputType !== 'radio') &&
                (inputType !== 'checkbox');
    };

    /**
     * Creates a wrapper around the input element
     * @param  DOMElement   inputElement
     * @return DOMElement                   wrapper
     */
    this.wrapInputElement = function (inputElement) {
        var wrapper = document.createElement('div');
        var clonedInput = inputElement.cloneNode(true);
        wrapper.classList.add(this.wrapperClass);
        wrapper.appendChild(clonedInput);
        wrapper.input = clonedInput;
        inputElement.parentNode.replaceChild(wrapper, inputElement);
        return wrapper;
    };

    /**
     * create external input border (for motion)
     * @param  DOMElement   inputElement
     * @return DOMElement                   border
     */
    this.createInputBorderInto = function (inputWrapper) {
        var border = document.createElement('div');
        border.classList.add(this.borderClass);
        inputWrapper.appendChild(border);
        return border;
    };

    /**
     * Creates the external input placeholder
     * @param  DOMElement inputWrapper
     * @return DOMElement               placeholder element
     */
    this.createExternalPlaceholderInto = function (inputWrapper) {
        var placeholderDOMElement = document.createElement("div");
        placeholderDOMElement.classList.add(this.placeholderClass);
        inputWrapper.appendChild(placeholderDOMElement);
        return placeholderDOMElement;
    };

    /**
     * Adds placeholder hide/show logic
     * @param DOMElement    inputElement        Input
     * @param DOMElement    placeholderElement  Placeholder
     */
    this.setPlaceholderLogicRelatedTo = function (inputElement, placeholderElement) {
        var self = this,
            placeholderText;

        if (inputElement.attributes.placeholder) {
            placeholderText = inputElement.attributes.placeholder.value;
            inputElement.attributes.placeholder.value = '';
            placeholderElement.innerHTML = placeholderText;
        }

        inputElement.addEventListener('input', function (e) {
            self.showPlaceholderIfInputIsEmpty(inputElement, placeholderElement);
        });

        self.showPlaceholderIfInputIsEmpty(inputElement, placeholderElement);
    };

    /**
     * Show/Hide placeholder according to input value
     * @param  DOMELement inputElement
     * @param  DOMELement placeholderElement
     */
    this.showPlaceholderIfInputIsEmpty = function (inputElement, placeholderElement) {
        if (inputElement.value !== '') {
            placeholderElement.classList.add(this.placeholderHiddenClass);
        } else {
            placeholderElement.classList.remove(this.placeholderHiddenClass);
        }
    };

    /**
     * Creates the validation icon element
     * @param  DOMELement   inputWrapper    Related input wrapper
     */
    this.createValidationIconFor = function (inputWrapper) {
        var validationElement = document.createElement("div");
        validationElement.classList.add(this.validationIconClass);
        inputWrapper.appendChild(validationElement);
    };

    /**
     * Binds class modification listener to the input
     * @param  DOMELement   inputElement    Related input
     */
    this.bindClassRemovalListenerTo = function (inputElement) {
        var self = this;

        inputElement.classChangeObserver = new MutationObserver(function (changeRecords) { self.classRemovalListener(changeRecords); });
        inputElement.classChangeObserver.observe(inputElement, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] });
    };

    /**
     * Implements the class removal listener
     * @param   changeRecords   Observer change records
     */
    this.classRemovalListener = function (changeRecords) {
        var self = this;

        changeRecords.forEach(function (record) {
            var oldClass = record.oldValue;
            var newClass = record.target.attributes['class'].value;

            if (oldClass.length > newClass.length) {
                var removedClasses = self.classesRemoved(oldClass, newClass);
                var removedValidationClass;
                var justRemovedClass;

                removedClasses.forEach(function (removedClass) {
                    if (self.validationClasses.indexOf(removedClass) !== -1) {
                        removedValidationClass = removedClass;
                    }
                });

                if (removedValidationClass.length > 0) {
                    self.transformToJustRemoved(record.target, removedClasses, removedValidationClass);
                }
            }
        });
    };

    /**
     * Add the 'just removed' class to the input, and creates a timeout for the final removal
     * @param  DOMELement   target                  target input
     * @param  array        removedClasses          classes just removed
     * @param  string       removedValidationClass  validation class just removed
     */
    this.transformToJustRemoved = function (target, removedClasses, removedValidationClass) {
        var self = this,
            justRemovedClass = removedValidationClass + self.justRemovedClassSuffix;

        if (removedClasses.indexOf(justRemovedClass) == -1) {
            target.classList.add(justRemovedClass);
            target.classList.add(removedValidationClass);
            target.classChangeObserver.disconnect();

            setTimeout(function () {
                self.removeDefinitely(target, removedValidationClass);
                self.bindClassRemovalListenerTo(target);
            }, self.validationAnimationTime);
        }
    };

    /**
     * Remove all the validation classes at the end of the animation
     * @param  DOMELement   target                  target input
     * @param  string       removedValidationClass  validation class just removed
     */
    this.removeDefinitely = function (target, removedValidationClass) {
        var justRemovedClass = removedValidationClass + this.justRemovedClassSuffix;

        target.classList.remove(justRemovedClass);
        target.classList.remove(removedValidationClass);
    };

    /**
     * Retrieve the removed classes
     * @param  string   previousClassesStr  previous class attribute contents
     * @param  string   currentClassesStr   current class attribute contents
     * @return array                        removed classes
     */
    this.classesRemoved = function (previousClassesStr, currentClassesStr) {
        var previousClasses = previousClassesStr.split(' ');
        var currentClasses = currentClassesStr.split(' ');

        return previousClasses.filter(function (x) { return currentClasses.indexOf(x) == -1; });
    };
}