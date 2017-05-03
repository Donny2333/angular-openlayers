/** @namespace */
aol.models.controls = {};

/**
 * This namespace contains helper functions for the layers directives.
 * @namespace
 */
aol.helpers.controls = {};

/**
 * Control base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(Element|undefined)} attributes.element               - element.
 * @property {(function|undefined)} attributes.render               - render.
 * @property {(Element|string|undefined)} attributes.target         - target.
 */
aol.models.controls.Control = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.element = undefined;
    this.attributes.render = undefined;
    this.attributes.target = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Attribution control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(boolean|undefined)} attributes.collapsible               - control collapsible?
 * @property {(boolean|undefined)} attributes.collapsed                 - control collapsed?
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(string|Node|undefined)} attributes.label                 - tip button label.
 * @property {(string|Node|undefined)} attributes.collapseLabel         - label of the expanded attributions button.
 */
aol.models.controls.Attribution = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.collapsible = undefined;
    this.attributes.collapsed = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.label = undefined;
    this.attributes.collapseLabel = undefined;
};

/**
 * FullScreen control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.label                 - label.
 * @property {(string|Node|undefined)} attributes.labelActive           - label when active.
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(boolean|undefined)} attributes.keys                      - full keyboard access?
 */
aol.models.controls.FullScreen = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.label = undefined;
    this.attributes.labelActive = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.keys = undefined;
};

/**
 * MousePosition control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                              - CSS class name.
 * @property {(ol.CoordinateFormatType | undefined)} attributes.coordinateFormat    - coordinate format.
 * @property {(ol.proj.ProjectionLike|undefined)} attributes.projection             - projection
 * @property {(string|undefined)} attributes.undefinedHTML                          - markup for undefined coordinates.
 */
aol.models.controls.MousePosition = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.coordinateFormat = undefined;
    this.attributes.projection = undefined;
    this.attributes.undefinedHTML = undefined;
    this.callbacks['change:coordinateFormat'] = undefined;
    this.callbacks['change:projection'] = undefined;
};

/**
 * OverviewMap control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(boolean|undefined)} attributes.collapsed                 - control collapsed?
 * @property {(string|Node|undefined)} attributes.collapseLabel         - label of the expanded attributions button.
 * @property {(boolean|undefined)} attributes.collapsible               - control collapsible?
 * @property {(string|Node|undefined)} attributes.label                 - label for the collapsed overviewmap button.
 * @property {(!ol.layer.Layer[]|ol.Collection | undefined)} attributes.layers  - layers.
 * @property {(string|undefined)} attributes.tipLabel                           - text label to use for the tip button.
 */
aol.models.controls.OverviewMap = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.collapsed = undefined;
    this.attributes.collapseLabel = undefined;
    this.attributes.collapsible = undefined;
    this.attributes.label = undefined;
    this.attributes.layers = undefined;
    this.attributes.tipLabel = undefined;
};

/**
 * Rotate control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.label                 - text label to use for the rotate button.
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(number|undefined)} attributes.duration                   - animation duration in milliseconds.
 * @property {(boolean|undefined)} attributes.autoHide                  - auto hide control.
 */
aol.models.controls.Rotate = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.label = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.duration = undefined;
    this.attributes.autoHide = undefined;
};

/**
 * ScaleLine control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                          - CSS class name.
 * @property {(string|Node|undefined)} attributes.minWidth                      - text label for the rotate button.
 * @property {(ol.control.ScaleLineUnits|string|undefined)} attributes.units    - units.
 */
aol.models.controls.ScaleLine = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.minWidth = undefined;
    this.attributes.units = undefined;
};

/**
 * Zoom control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(number|undefined)} attributes.duration                   - animation duration in milliseconds.
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.zoomInLabel           - text label to use for the zoom-in button.
 * @property {(string|Node|undefined)} attributes.zoomOutLabel          - text label to use for the zoom-out button.
 * @property {(number|undefined)} attributes.delta                      - delta applied in-between each zoom.
 */
aol.models.controls.Zoom = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.duration = undefined;
    this.attributes.className = undefined;
    this.attributes.zoomInLabel = undefined;
    this.attributes.zoomOutLabel = undefined;
    this.attributes.delta = undefined;
};

/**
 * ZoomSlider control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(number|undefined)} attributes.duration                   - animation duration in milliseconds.
 * @property {(number|undefined)} attributes.maxResolution              - max resolution.
 * @property {(number|undefined)} attributes.minResolution              - min resolution.
 */
aol.models.controls.ZoomSlider = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.duration = undefined;
    this.attributes.maxResolution = undefined;
    this.attributes.minResolution = undefined;
};

/**
 * ZoomToExtent control model class.
 *
 * @class
 * @augments aol.models.controls.Control
 * @property {(string|undefined)} attributes.className                  - CSS class name.
 * @property {(string|Node|undefined)} attributes.label                 - text label to use for the rotate button.
 * @property {(string|undefined)} attributes.tipLabel                   - text label to use for the tip button.
 * @property {(number|undefined)} attributes.extent                     - animation duration in milliseconds.
 */
aol.models.controls.ZoomToExtent = function() {
    aol.models.controls.Control.apply(this, arguments);
    this.attributes.className = undefined;
    this.attributes.label = undefined;
    this.attributes.tipLabel = undefined;
    this.attributes.extent = undefined;
};

/**
 * Attribution control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlAttribution = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlAttribution';
    this.require = ['^aolMap'];
    this.instance = ol.control.Attribution;
    this.model = aol.models.controls.Attribution;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * Fullscreen control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlFullScreen = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlFullscreen';
    this.require = ['^aolMap'];
    this.instance = ol.control.FullScreen;
    this.model = aol.models.controls.FullScreen;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * MousePosition control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlMousePosition = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlMouseposition';
    this.require = ['^aolMap'];
    this.instance = ol.control.MousePosition;
    this.model = aol.models.controls.MousePosition;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * OverviewMap control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlOverviewMap = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlOverviewmap';
    this.require = ['^aolMap'];
    this.instance = ol.control.OverviewMap;
    this.model = aol.models.controls.OverviewMap;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * Rotate control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlRotate = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlRotate';
    this.require = ['^aolMap'];
    this.instance = ol.control.Rotate;
    this.model = aol.models.controls.Rotate;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * ScaleLine control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlScaleLine = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlScaleline';
    this.require = ['^aolMap'];
    this.instance = ol.control.ScaleLine;
    this.model = aol.models.controls.ScaleLine;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * Zoom control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlZoom = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlZoom';
    this.require = ['^aolMap'];
    this.instance = ol.control.Zoom;
    this.model = aol.models.controls.Zoom;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * ZoomSlider control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlZoomSlider = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlZoomslider';
    this.require = ['^aolMap'];
    this.instance = ol.control.ZoomSlider;
    this.model = aol.models.controls.ZoomSlider;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

/**
 * ZoomToExtent control directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.ControlZoomToExtent = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolControlZoomtoextent';
    this.require = ['^aolMap'];
    this.instance = ol.control.ZoomToExtent;
    this.model = aol.models.controls.ZoomToExtent;
    this.onParentInstance = function(parentInst, instance) {parentInst.addControl(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeControl(instance);};
};

aol.registerDirective(new aol.directives.ControlAttribution());
aol.registerDirective(new aol.directives.ControlFullScreen());
aol.registerDirective(new aol.directives.ControlMousePosition());
aol.registerDirective(new aol.directives.ControlOverviewMap());
aol.registerDirective(new aol.directives.ControlRotate());
aol.registerDirective(new aol.directives.ControlScaleLine());
aol.registerDirective(new aol.directives.ControlZoom());
aol.registerDirective(new aol.directives.ControlZoomSlider());
aol.registerDirective(new aol.directives.ControlZoomToExtent());

