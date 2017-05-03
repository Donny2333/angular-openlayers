/** @namespace */
aol.models.geometries = {};

/**
 * This namespace contains helper functions for the geometries directives.
 * @namespace
 */
aol.helpers.geometries = {};

/**
 * Teleport geometry on coordinates attributes change
 * @param coordinates
 * @param u1_
 * @param u2_
 * @param instanceCtrl
 */
aol.helpers.geometries.teleportOnCoordinateChange = function (coordinates, u1_, u2_, instanceCtrl) {
    instanceCtrl.getPromise().then(function (instance) {instance.setCoordinates(coordinates);});
};

/**
 * Slide geometry on coordinates attributes change, 350ms duration.
 * @param {number[]} coordinates - updated coordinates.
 * @param {*} u1_ - unused
 * @param {Object} scope - directive scope
 * @param {Object} instanceCtrl
 * @param {*} u2_ - unused
 * @param {string[]} controllers
 */
aol.helpers.geometries.slideOnCoordinateChange = function (coordinates, u1_, scope, instanceCtrl, u2_, controllers) {
    var mapController = controllers[controllers.length-1];
    mapController.getPromise().then(function(map) {
        instanceCtrl.getPromise().then(function (instance) {
            var duration = 350;
            var startTime = new Date().getTime();
            var startCoord = instance.getCoordinates();
            var displacement = [coordinates[0] - startCoord[0], coordinates[1] - startCoord[1]];
            var currentCoord  = [startCoord[0], startCoord[1]];
            var elapsedRatio = 0;
            var progress = 0;
            var easing = ol.easing.inAndOut;

            if (angular.isDefined(scope.__listenerId__)) {
                ol.Observable.unByKey(scope.__listenerId__);
                scope.__listenerId__ = undefined;
            }
            function step(event) {
                elapsedRatio = Math.min(1, (event.frameState.time - startTime) / duration);
                progress = easing(elapsedRatio);
                currentCoord[0] = startCoord[0] + progress * displacement[0];
                currentCoord[1] = startCoord[1] + progress * displacement[1];

                instance.setCoordinates(currentCoord);
                if (elapsedRatio === 1) {
                    ol.Observable.unByKey(scope.__listenerId__);
                    scope.__listenerId__ = undefined;
                    event.frameState.animate = false;
                } else {
                    event.frameState.animate = true;
                }
            }
            scope.__listenerId__ = map.on('postcompose', step);
            map.render();
        });
    });
};



/**
 * Overrides on ol.geom.* constructors to cope with inconsistent signatures.
 * @namespace */
aol.overrides.geometries = {};

/**
 * Circle instance override
 *
 * @param {{center: number[], radius: number, layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.Circle}
 * @constructor
 */
aol.overrides.geometries.Circle = function(attributes){
    return new ol.geom.Circle(attributes.center, attributes.radius, attributes.layout);
};

/**
 * LinearRing instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.LinearRing}
 * @constructor
 */
aol.overrides.geometries.LinearRing = function(attributes){
    return new ol.geom.LinearRing(attributes.coordinates, attributes.layout);
};

/**
 * LineString instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.LineString}
 * @constructor
 */
aol.overrides.geometries.LineString = function(attributes){
    return new ol.geom.LineString(attributes.coordinates, attributes.layout);
};

/**
 * MultiLineString instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.MultiLineString}
 * @constructor
 */
aol.overrides.geometries.MultiLineString = function(attributes){
    return new ol.geom.MultiLineString(attributes.coordinates, attributes.layout);
};

/**
 * MultiPoint instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.MultiPoint}
 * @constructor
 */
aol.overrides.geometries.MultiPoint = function(attributes){
    return new ol.geom.MultiPoint(attributes.coordinates, attributes.layout);
};

/**
 * MultiPolygon instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.MultiPolygon}
 * @constructor
 */
aol.overrides.geometries.MultiPolygon = function(attributes){
    return new ol.geom.MultiPolygon(attributes.coordinates, attributes.layout);
};

/**
 * Point instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.Point}
 * @constructor
 */
aol.overrides.geometries.Point = function(attributes){
    return new ol.geom.Point(attributes.coordinates, attributes.layout);
};

/**
 * Polygon instance override
 *
 * @param {{coordinates: (ol.Coordinate[]|undefined), layout: (ol.geom.GeometryLayout|undefined)}} attributes - attributes
 * @returns {ol.geom.Polygon}
 * @constructor
 */
aol.overrides.geometries.Polygon = function(attributes){
    return new ol.geom.Polygon(attributes.coordinates, attributes.layout);
};

/**
 * Geometry base model class.
 *
 * @class
 * @augments aol.models.Model
 */
aol.models.geometries.SimpleGeometry = function() {
    aol.models.Model.apply(this, arguments);
    this.watchers['coordinates'] = aol.helpers.geometries.teleportOnCoordinateChange;
    this.callbacks['change'] = undefined;
    this.callbacks['propertychange'] = undefined;
};

/**
 * Circle Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate|number[]|undefined)} attributes.center   - center.
 * @property {(number|undefined)} attributes.radius                   - radius.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout   - layout.
 */
aol.models.geometries.Circle = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.center = undefined;
    this.attributes.radius = undefined;
    this.attributes.layout = undefined;
};

/**
 * LinearRing Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates     - coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout   - layout.
 */
aol.models.geometries.LinearRing = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * LineString Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates     - coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout   - layout.
 */
aol.models.geometries.LineString = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * MultiLineString Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(Array.<ol.Coordinate[]>|undefined)} attributes.coordinates     - list of linestrings coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout           - layout.
 */
aol.models.geometries.MultiLineString = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * MultiPoint Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate[]|undefined)} attributes.coordinates             - list of point coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout           - layout.
 */
aol.models.geometries.MultiPoint = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * MultiPolygon Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(Array.<Array.<ol.Coordinate[]>>|undefined)} attributes.coordinates     - list of polygon coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout                   - layout.
 */
aol.models.geometries.MultiPolygon = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * Point Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(ol.Coordinate|number[]|undefined)} attributes.coordinates     - coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout          - layout.
 */
aol.models.geometries.Point = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * Polygon Geometry model class.
 *
 * @class
 * @augments aol.models.geometries.SimpleGeometry
 * @property {(Array.<ol.Coordinate[]>|undefined)} attributes.coordinates     - list of edge coordinates.
 * @property {(ol.geom.GeometryLayout|undefined)} attributes.layout            - layout.
 */
aol.models.geometries.Polygon = function() {
    aol.models.geometries.SimpleGeometry.apply(this, arguments);
    this.attributes.coordinates = undefined;
    this.attributes.layout = undefined;
};

/**
 * GeometryCircle directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryCircle = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryCircle';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.Circle;
    this.model = aol.models.geometries.Circle;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryLinearRing directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryLinearRing = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryLinearring';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.LinearRing;
    this.model = aol.models.geometries.LinearRing;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryLineString directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryLineString = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryLinestring';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.LineString;
    this.model = aol.models.geometries.LineString;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryMultiLineString directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryMultiLineString = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryMultilinestring';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.MultiLineString;
    this.model = aol.models.geometries.MultiLineString;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryMultiPoint directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryMultiPoint = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryMultipoint';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.MultiPoint;
    this.model = aol.models.geometries.MultiPoint;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryMultiPolygon directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryMultiPolygon = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryMultipolygon';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.MultiPolygon;
    this.model = aol.models.geometries.MultiPolygon;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryPoint directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryPoint = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryPoint';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.Point;
    this.model = aol.models.geometries.Point;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

/**
 * GeometryPolygon directive class.
 * @class
 * @augments aol.Directive
 */
aol.directives.GeometryPolygon = function() {
    aol.Directive.apply(this, arguments);
    this.name = 'aolGeometryPolygon';
    this.require = ['?^aolFeature', '?^aolStyle', '^^aolMap'];
    this.instance = aol.overrides.geometries.Polygon;
    this.model = aol.models.geometries.Polygon;
    this.onParentController = function(parentCtrl, instance) {parentCtrl.setGeometry(instance);};
};

aol.registerDirective(new aol.directives.GeometryCircle());
aol.registerDirective(new aol.directives.GeometryLinearRing());
aol.registerDirective(new aol.directives.GeometryLineString());
aol.registerDirective(new aol.directives.GeometryMultiLineString());
aol.registerDirective(new aol.directives.GeometryMultiPoint());
aol.registerDirective(new aol.directives.GeometryMultiPolygon());
aol.registerDirective(new aol.directives.GeometryPoint());
aol.registerDirective(new aol.directives.GeometryPolygon());

