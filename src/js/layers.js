/** @namespace */
aol.models.layers = {};

/**
 * This namespace contains helper functions for the layers directives.
 * @namespace
 */
aol.helpers.layers = {};

/**
 * This namespace contains helper functions for the heatmap directive.
 * @namespace
 */
aol.helpers.layers.base = {};

/**
 * add layer to parent instance
 * @param parentInst
 * @param instance
 * @param parentCtrl
 */
aol.helpers.layers.base.onParentInstance = function(parentInst, instance, parentCtrl) {
    switch(parentCtrl.name){
        case 'aolCollectionLayer':
            parentInst.push(instance);
            break;
        case 'aolMap':
            parentInst.addLayer(instance);
            break;
        default:
            aol.log.error(this.name + '\' parent is invalid: ', parentCtrl.name);
            break;
    }
};

/**
 * remove instance from parent
 * @param parentInst
 * @param instance
 * @param parentCtrl
 */
aol.helpers.layers.base.onDestroy = function(parentInst, instance, parentCtrl) {
    switch(parentCtrl.name){
        case 'aolCollectionLayer':
            parentInst.remove(instance);
            break;
        case 'aolMap':
            parentInst.removeLayer(instance);
            break;
        default:
            aol.log.error(this.name + '\' parent is invalid: ', parentCtrl.name);
            break;
    }
};


/**
 * This namespace contains helper functions for the heatmap directive.
 * @namespace
 */
aol.helpers.layers.heatmap = {};


/**
 * update radius on radius attribute change
 * @param radius
 * @param u1_
 * @param u2_
 * @param instanceCtrl
 */
aol.helpers.layers.heatmap.updateRadiusOnRadiusChange = function (radius, u1_, u2_, instanceCtrl) {
    instanceCtrl.getPromise().then(function (instance) {instance.setRadius(parseFloat(radius));});
};

/**
 * Layer base model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(number|undefined)} attributes.brightness       - brightness.
 * @property {(number|undefined)} attributes.contrast         - contrast.
 * @property {(number|undefined)} attributes.hue              - hue.
 * @property {(number|undefined)} attributes.opacity          - opacity.
 * @property {(number|undefined)} attributes.saturation       - saturation.
 * @property {(boolean|undefined)} attributes.visible         - is the layer visible?.
 * @property {(ol.Extent|undefined)} attributes.extent        - extent (where the layer is shown).
 * @property {(number|undefined)} attributes.zIndex           - zIndex (highest zIndex layer is on top).
 * @property {(number|undefined)} attributes.minResolution    - min resolution.
 * @property {(number|undefined)} attributes.maxResolution    - max resolution.
 */
aol.models.layers.Layer = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.brightness = undefined;
    this.attributes.contrast = undefined;
    this.attributes.hue = undefined;
    this.attributes.opacity = undefined;
    this.attributes.saturation = undefined;
    this.attributes.visible = undefined;
    this.attributes.extent = undefined;
    this.attributes.zIndex = undefined;
    this.attributes.minResolution = undefined;
    this.attributes.maxResolution = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:brightness'] = undefined;
    this.callbacks['change:contrast'] = undefined;
    this.callbacks['change:extent'] = undefined;
    this.callbacks['change:hue'] = undefined;
    this.callbacks['change:maxResolution'] = undefined;
    this.callbacks['change:minResolution'] = undefined;
    this.callbacks['change:opacity'] = undefined;
    this.callbacks['change:saturation'] = undefined;
    this.callbacks['change:visible'] = undefined;
    this.callbacks['change:zIndex'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Heatmap layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {(string[]|undefined)} attributes.gradient    - gradient of the heatmap as CSS color strings, e.g. '#00f'
 * @property {(number|undefined)} attributes.radius        - radius.
 * @property {(number|undefined)} attributes.blur          - blur.
 * @property {(number|undefined)} attributes.shadow        - opacity.
 * @property {(number|undefined)} attributes.weight        - saturation.
 * @property {(ol.source.Vector|undefined)} attributes.source   - source.
 */
aol.models.layers.Heatmap = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.gradient = undefined;
    this.attributes.radius = 8;
    this.attributes.blur = undefined;
    this.attributes.shadow = undefined;
    this.attributes.weight = undefined;
    this.attributes.source = undefined;
    this.watchers['radius'] = aol.helpers.layers.heatmap.updateRadiusOnRadiusChange;
    this.callbacks['change:gradient'] = undefined;
    this.callbacks['change:blur'] = undefined;
    this.callbacks['change:radius'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

/**
 * Image layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {(ol.source.Image|undefined)} attributes.source  - source.
 * @property {(ol.Map|undefined)} attributes.map              - map on which the layers is overlain.
 */
aol.models.layers.Image = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.source = undefined;
    this.attributes.map = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

/**
 * Tile layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {(ol.source.Image|undefined)} attributes.source          - source.
 * @property {(ol.Map|undefined)} attributes.map                      - map on which the layers is overlain.
 * @property {(number|undefined)} attributes.preload                  - set the layer as an overlay on map.
 * @property {(boolean|undefined)} attributes.useInterimTilesOnError  - use interim tile on load error?
 */
aol.models.layers.Tile = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.source = undefined;
    this.attributes.map = undefined;
    this.attributes.preload = undefined;
    this.attributes.useInterimTilesOnError = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['change:preload'] = undefined;
    this.callbacks['change:useInterimTilesOnError'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};

/**
 * Vector layer model class.
 *
 * @class
 * @augments aol.models.layers.Layer
 * @property {function|undefined} attributes.renderOrder        - function to order the rendering of vectors.
 * @property {(number|undefined)} attributes.renderBuffer       - number of pixels to render outside of the viewport.
 * @property {(ol.source.Vector|undefined)} attributes.source    - source.
 * @property {(ol.style.Style|ol.style.Style[]|ol.style.StyleFunction|undefined)} attributes.style    -  style.
 * @property {(ol.Map|undefined)} attributes.map                        - map on which the layers is overlain.
 * @property {(boolean|undefined)} attributes.updateWhileAnimating      - update while animating the source objects?
 * @property {(boolean|undefined)} attributes.updateWhileInteracting    - update while interacting with the map?
 */
aol.models.layers.Vector = function() {
    aol.models.layers.Layer.apply(this, arguments);
    this.attributes.renderOrder = undefined;
    this.attributes.renderBuffer = undefined;
    this.attributes.source = undefined;
    this.attributes.style = undefined;
    this.attributes.map = undefined;
    this.attributes.updateWhileAnimating = undefined;
    this.attributes.updateWhileInteracting = undefined;
    this.callbacks['change:source'] = undefined;
    this.callbacks['postcompose'] = undefined;
    this.callbacks['precompose'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['render'] = undefined;
};



/**
 * LayerHeatmap directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerHeatmap = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerHeatmap';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Heatmap;
    this.model = aol.models.layers.Heatmap;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

/**
 * LayerImage directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerImage = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerImage';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Image;
    this.model = aol.models.layers.Image;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

/**
 * LayerTile directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerTile = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerTile';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Tile;
    this.model = aol.models.layers.Tile;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

/**
 * LayerVector directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.LayerVector = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolLayerVector';
    this.require = ['?^aolCollectionLayer', '^aolMap'];
    this.replace = true;
    this.instance = ol.layer.Vector;
    this.model = aol.models.layers.Vector;
    this.onParentInstance = aol.helpers.layers.base.onParentInstance;
    this.onDestroy = aol.helpers.layers.base.onDestroy;
};

aol.registerDirective(new aol.directives.LayerHeatmap());
aol.registerDirective(new aol.directives.LayerImage());
aol.registerDirective(new aol.directives.LayerTile());
aol.registerDirective(new aol.directives.LayerVector());
