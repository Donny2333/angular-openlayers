/**
 * Overlay model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(Element|undefined)} attributes.element                             - element to overlay on the map.
 * @property {(number[]|undefined)} attributes.offset                             - position offset of the overlay.
 * @property {(ol.Coordinate|undefined)} attributes.position                      - position.
 * @property {(ol.OverlayPositioning|string|undefined)} attributes.positioning    - positioning, e.g. 'center-center'.
 * @property {(boolean|undefined)} attributes.stopEvent                           - stop event propagation?
 * @property {(boolean|undefined)} attributes.insertFirst                         - inserted in first position?
 * @property {(ol.Extent|undefined)} attributes.autoPan                           - autoPan the map on setPosition?
 * @property {(olx.animation.PanOptions|undefined)} attributes.autoPanAnimation   - autoPan animation.
 * @property {(number|undefined)} attributes.autoPanMargin                        - margin around overlay on auto-pan.
 */
aol.models.Overlay = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.element = undefined;
    this.attributes.offset = undefined;
    this.attributes.position = undefined;
    this.attributes.positioning = undefined;
    this.attributes.stopEvent = undefined;
    this.attributes.insertFirst = undefined;
    this.attributes.autoPan = undefined;
    this.attributes.autoPanAnimation = undefined;
    this.attributes.autoPanMargin = undefined;
    this.watchers['position'] = function(newValue, oldValue, scope, instanceController) {
        instanceController.getPromise().then(function(instance) {instance.setPosition(newValue);});
    };
    this.callbacks['change'] = undefined;
    this.callbacks['change:element'] = undefined;
    this.callbacks['change:map'] = undefined;
    this.callbacks['change:offset'] = undefined;
    this.callbacks['change:position'] = undefined;
    this.callbacks['change:positioning'] = undefined;
    this.callbacks['propertychange'] = undefined;

};

/**
 * Overlay directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Overlay = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolOverlay';
    this.require = ['^aolMap'];
    this.transclude = true;
    this.template = '<div class="aol-overlay" ng-transclude></div>';
    this.instance = ol.Overlay;
    this.model = aol.models.Overlay;
    this.onPreInstance = function(scope, element) {scope.element = element[0].getElementsByClassName('aol-overlay')[0];};
    this.onParentInstance = function(parentInst, instance) {parentInst.addOverlay(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeOverlay(instance);};
};

aol.registerDirective(new aol.directives.Overlay());

