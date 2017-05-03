/**
 * View model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {number[]} attributes.center                           - center (defaults to lon:0, lat:0).
 * @property {number|undefined} attributes.maxResolution            - max resolution.
 * @property {number|undefined} attributes.minResolution            - min resolution.
 * @property {number|undefined} attributes.maxZoom                  - max zoom.
 * @property {number|undefined} attributes.minZoom                  - min zoom.
 * @property {ol.proj.Projection|undefined} attributes.projection   - projection.
 * @property {number|undefined} attributes.resolution               - resolution.
 * @property {number[]|undefined} attributes.resolutions            - list of resolutions.
 * @property {number|undefined} attributes.rotation                 - view's orientation (radians).
 * @property {number} attributes.zoom                               - zoom (the bigger, the closer to the ground).
 * @property {number|undefined} attributes.zoomFactor               - zoom multiplier/divider when zooming in/out.
 * @property {function|undefined} watchers['center']                - on center attribute change, update the center.
 * @property {function|undefined} watchers['zoom']                  - on zoom attribute change, update the zoom.
 */
aol.models.View = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.center = [0, 0];
    this.attributes.maxResolution = undefined;
    this.attributes.minResolution = undefined;
    this.attributes.maxZoom = undefined;
    this.attributes.minZoom = undefined;
    this.attributes.projection = undefined;
    this.attributes.resolution = undefined;
    this.attributes.resolutions = undefined;
    this.attributes.rotation = undefined;
    this.attributes.zoom = 2;
    this.attributes.zoomFactor = undefined;
    this.watchers['center'] = function(newValue, oldValue, scope, instanceController) {
        instanceController.getPromise().then(function(instance) {instance.setCenter(newValue);});
    };
    this.watchers['zoom'] = function(newValue, oldValue, scope, instanceController) {
        instanceController.getPromise().then(function(instance) {instance.setZoom(newValue);});
    };
    this.callbacks['change:center'] = undefined;
    this.callbacks['change:resolution'] = undefined;
    this.callbacks['change:rotation'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * View directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.View = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolView';
    this.require = ['^aolMap'];
    this.instance = ol.View;
    this.model = aol.models.View;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setView(instance);};
};

aol.registerDirective(new aol.directives.View());