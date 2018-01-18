/**
 * Highlights the field label on focus
 */
function HM_LabelFocus() {
    this.activeLabelClassName = '{root}{object}label--focus';

    this.onInit = function (applyTo) {
        var self = this;

        self.activeLabelClassName = HammeriteJS.replaceWithPrefixes(self.activeLabelClassName);

        [].forEach.call(applyTo, function (labelElement) {
            var myLabel = self.findMyLabel(labelElement);

            if (myLabel) {
                var elementType = labelElement.type;
                var typeClassName = self.activeLabelClassName.replace('focus', 'for-' + elementType);
                myLabel.classList.add(typeClassName);

                labelElement.addEventListener('focus', function () {
                    myLabel.classList.add(self.activeLabelClassName);
                });

                labelElement.addEventListener('blur', function () {
                    myLabel.classList.remove(self.activeLabelClassName);
                });
            }
        });

    };

    /**
     * searchs for input label:
     *  - first, tries to find input 'id' or 'name' in any label for='...'
     *  - if not, returns previous element if it's a label
     * @param  HTMLElement inputObj
     * @return HTMLElement              Found label (HTMLElement), null if not found
     */
    this.findMyLabel = function (inputObj) {
        var label,
            previousElement,
            forTarget = inputObj.id ? inputObj.id : inputObj.name;

        if (forTarget) {
            label = document.querySelectorAll('label[for=' + forTarget + ']')[0];
        }

        if (!label) {
            previousElement = inputObj.previousElementSibling;

            if (!previousElement) {
                previousElement = inputObj.parentElement.previousElementSibling;
            }

            if (previousElement && (previousElement.nodeName === 'LABEL')) {
                label = previousElement;
            }
        }

        return label;
    };

}