/**
 * Style range slider (Chrome doesn't allow :before and :after styling on range sliders)
 */
function HM_InputRange() {

    this.track_prefs = ['webkit-slider-runnable', 'moz-range', 'ms'];

    this.onInit = function(applyTo) {
        var self = this,
            n;

        for (n = 0; n < applyTo.length; n++) {
            applyTo[n].rangeStyle = document.createElement('style');
            document.body.appendChild(applyTo[n].rangeStyle);

            this.updateRangeValue(applyTo[n]);

            applyTo[n].addEventListener('input', function() {
                self.updateRangeValue(this);
            }, false);
        }
    };

    this.updateRangeValue = function(element) {
        element.rangeStyle.textContent = this.getTrackStyleStr(
            element.id,
            this.getValStr(element, element.value),
            this.track_prefs
        );
    };

    this.getTrackStyleStr = function(id, val, prefs) {
        var str = '',
            len = prefs.length;

        for (var i = 0; i < len; i++) {
            str += '#' + id + '::-' + prefs[i] + '-track{background-size:' + val + '}';
        }

        return str;
    };

    this.getValStr = function(el, p, i) {
        var min = el.min || 0,
            perc = (el.max) ? ~~(100 * (p - min) / (el.max - min)) : p,
            val = perc + '% 100%';

        return val;
    };
}
