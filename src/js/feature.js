/**
 * Feature model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.geom.Geometry|Object|undefined)} attributes.geometry                                 - geometry.
 * @property {(ol.style.Style|ol.style.Style[]|ol.FeatureStyleFunction|undefined)} attributes.style    - style.
 * @property {(Object|undefined)} attributes.properties                                                - properties.
 */
aol.models.Feature = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.geometry = undefined;
    this.attributes.style = undefined;
    this.attributes.properties = undefined;
    this.callbacks['change'] = undefined;
    this.callbacks['change:geometry'] = undefined;
    this.callbacks['change:style'] = undefined;
    this.callbacks['change:id'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Feature directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Feature = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolFeature';
    this.require = ['^aolSourceVector'];
    this.instance = ol.Feature;
    this.model = aol.models.Feature;
    this.onParentInstance = function(parentInst, instance) {parentInst.addFeature(instance);};
    this.onDestroy = function(parentInst, instance) { parentInst.removeFeature(instance);};
};

aol.registerDirective(new aol.directives.Feature());
