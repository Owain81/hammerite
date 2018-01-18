/**
 * Highlights the row and column headers when editing a editable table cell
 */
function HM_EditableTableFocus() {

    this.activeEditionClassName = 'is--edition-active';

    this.onInit = function (tableInputs) {
        var self = this;

        tableInputs.forEach(function (tableInput) {
            tableInput.addEventListener('focus', function () {
                self.findMyColumnHead(this).classList.add(self.activeEditionClassName);
                self.findMyRow(this).classList.add(self.activeEditionClassName);
            });

            tableInput.addEventListener('blur', function () {
                self.findMyColumnHead(this).classList.remove(self.activeEditionClassName);
                self.findMyRow(this).classList.remove(self.activeEditionClassName);
            });
        });
    };

    this.findMyColumnHead = function (tableInput) {
        var myCellIndex = tableInput.parentElement.cellIndex;
        return this.findParentOfType(tableInput, 'table').querySelectorAll('th')[myCellIndex];
    };

    this.findMyRow = function (tableInput) {
        return this.findParentOfType(tableInput, 'tr');
    };

    this.findParentOfType = function (element, nodeType) {
        while (element && (element.tagName.toLowerCase() !== nodeType.toLowerCase())) {
            element = element.parentElement;
        }
        return element;
    };
}