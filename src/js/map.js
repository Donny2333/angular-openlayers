/**
 * Map model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(ol.Collection|undefined)} attributes.controls      - default controls.
 * @property {(ol.Collection|undefined)} attributes.interactions  - default interactions.
 * @property {(ol.Collection|undefined)} attributes.layers        - default layers (none).
 * @property {(ol.Collection|undefined)} attributes.logo          - default logo (the OpenLayers logo).
 * @property {(ol.Collection|undefined)} attributes.overlays      - default overlays (none).
 * @property {(ol.RendererType|undefined)} attributes.renderer    - default renderer (browser dependent, usually Canvas).
 * @property {(ol.View|undefined)} attributes.view                - default view (world map, centered on lat:0, lon:0).
 */
aol.models.Map = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.controls = [];
    this.attributes.interactions = undefined;
    this.attributes.layers = undefined;
    this.attributes.logo = undefined;
    this.attributes.overlays = undefined;
    this.attributes.renderer = undefined;
    this.attributes.target = undefined;
    this.attributes.view = new ol.View({center: [0, 0], zoom: 1});
    this.callbacks['change'] = undefined;
    this.callbacks['change:layerGroup'] = undefined;
    this.callbacks['change:size'] = undefined;
    this.callbacks['change:target'] = undefined;
    this.callbacks['change:view'] = undefined;
    this.callbacks['click'] = undefined;
    this.callbacks['dblclick'] = undefined;
    this.callbacks['moveend'] = undefined;
    this.callbacks['pointermove'] = undefined;
    this.callbacks['propertychange'] = undefined;
    this.callbacks['singleclick'] = undefined;
};

/**
 * Map directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Map = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolMap';
    this.transclude = true;
    this.replace = true;
    this.template = '<div class="aol-fill" ng-transclude></div>';
    this.instance = ol.Map;
    this.model = aol.models.Map;
    this.onPreInstance = function(scope, element) {
        scope.target = element[0];
    };
};

aol.registerDirective(new aol.directives.Map());
