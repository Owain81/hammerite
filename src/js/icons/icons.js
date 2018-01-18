/**
 * Async icons SVG sprite loading
 */
function HM_Icons() {
    this.spriteAdded = false;
    this.spritePath;

    this.onInit = function (applyTo) {
        var self = this;
        if (!this.spriteAdded) {
            this.spritePath = HammeriteConfig['sprite-path'];
            this.loadSVGSprite(function (spriteContent) {
                self.addSpriteToDOM(spriteContent);
                self.spriteAdded = true;
            });
        }
    };

    /**
   	 * Loads SVG sprite asynchronously
   	 * @param  function loadCallBack
   	 */
    this.loadSVGSprite = function (loadCallBack) {
        var spriteURL = HammeriteJS.URL + this.spritePath,
            ajaxCall = new XMLHttpRequest();

        ajaxCall.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    loadCallBack(ajaxCall.responseText);
                } else {
                    console.error('Unable to load SVG icons sprite.' +
                        ' Please refer http://ux.unit4.com/designsystem/ for more information.' + 
                        ' SVG icons sprite expected to be in ' + spriteURL);
                }
            }
        };

        ajaxCall.open('GET', spriteURL, true);
        ajaxCall.send();
    };

    /**
   	 * adds a new DOM element for the SVG sprite
   	 * @param string spriteContent SVG sprite content
   	 */
    this.addSpriteToDOM = function (spriteContent) {
        var newDOMElement = document.createElement('div');
        newDOMElement.innerHTML = spriteContent;
        newDOMElement.style.display = 'none';
        document.body.insertBefore(newDOMElement, document.body.childNodes[0]);
    };

}