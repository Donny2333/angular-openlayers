/**
 * Projection model class.
 *
 * @class
 * @augments aol.models.Model
 * @property {(string|Object|undefined)} attributes.code            - SRS identifier code, e.g. EPSG:4326.
 * @property {(ol.proj.Units|string|undefined)} attributes.units    - units.
 * @property {(ol.Extent|undefined)} attributes.extent              -  validity extent for the SRS.
 * @property {(string|undefined)} attributes.axisOrientation        - The axis orientation as specified in Proj4.
 * @property {(boolean|undefined)} attributes.global                - projection is valid for the whole globe?
 * @property {(ol.Extent|undefined)} attributes.worldExtent         - world extent for the SRS.
 * @property {(function|undefined)} attributes.getPointResolution   - Function to determine resolution at a point.
 */
aol.models.Projection = function() {
    aol.models.Model.apply(this, arguments);
    this.attributes.code = undefined;
    this.attributes.units = undefined;
    this.attributes.extent = undefined;
    this.attributes.axisOrientation = undefined;
    this.attributes.global = undefined;
    this.attributes.worldExtent = undefined;
    this.attributes.getPointResolution = undefined;
};

/**
 * Feature directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.Projection = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolProjection';
    this.require = ['?^aolCoordinate', '?^aolSourceCluster', '?^aolSourceImagecanvas', '?^aolSourceImagemapguide',
        '?^aolSourceImagemapguide', '?^aolSourceImagestatic', '?^aolSourceImagevector', '?^aolSourceImagewms',
        '?^aolSourceTilearcgisrest', '?^aolSourceTileimage', '?^aolSourceTilewms', '?^aolSourceWmts',
        '?^aolSourceXyz', '?^aolView', '?^aolControlMouseposition'];
    this.instance = ol.proj.Projection;
    this.model = aol.models.Projection;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setProjection(instance);};
};

aol.registerDirective(new aol.directives.Projection());
